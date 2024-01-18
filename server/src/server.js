const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("../model/model");
const auth = require('../routes/auth.routes');
const path = require("path");
const fileUploads = require("express-fileupload");
const MailService = require("./service/mail/mailer.service")
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const passport = require("passport");
const VKontakteStrategy = require("passport-vkontakte").Strategy;

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("cookie-parser")());

app.use("/auth", auth);

app.use(
  require("express-session")({
    secret: "keyboard-cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

passport.use(
  new VKontakteStrategy(
    {
      clientID: "51644243",
      clientSecret: "HykUDaGKZ5EwrWFmFb2q",
      callbackURL: "http://localhost:8080/auth/vkontakte/callback", //где найти url на случаи успеха и неудачи
      scope: ["email"],
      profileFields: ['email'],
    },
    async function (accessToken, refreshToken, params, profile, done) {
      try {
        const [user, created] = await db.user.findOrCreate({
          where: { id: profile.id }, defaults: {
            username: profile.name.givenName,

          }
        })
        return done(null, profile);
      }
      catch (err) {
        console.log(err);
        return done(err)
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("SERIALIZE", user);
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (data, done) {
  console.log("DESERIALIZE", data);
  done(null, JSON.parse(data));
});


app.get("/auth/vkontakte", passport.authenticate("vkontakte"));

app.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    successRedirect: "/vkuser", //направить после успеха
    failureRedirect: "http://localhost:3000/auth", //направить после неудачи
  })
);

app.get("/vkuser", async function (req, res) { //инфа о пользователе
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const user = await db.user.findByPk(req.user.id);
    if (user && !user.email && req.user.emails) {
      user.email = req.user.emails[0].value;
      await user.save()
    }

    res.redirect(`http://localhost:3000/vk/${user.id}`)
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }

});


//Таблица товары//
app.get('/product/:id', async (req, res) => {
  const productId = req.params.id;
  const product = await db.product.findByPk(productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product);
});
app.get('/isproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.product.findByPk(productId);

    if (!product) {
      res.status(404).json({ message: false });
    }
    else { res.status(200).json({ message: true }) }
  } catch (err) {
    console.error(err.message);
  }
});
app.get('/products', async (req, res) => {
  try {
    const products = await db.product.findAll({ order: [['id', 'ASC']] });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.get("/products/:catId", async (req, res) => {

  const category = req.params.catId;
  try {
    let products;
    if (category === '7') {
      products = await db.product.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: { catid: category },
        order: [['id', 'ASC']]
      });
    } else {
      products = await db.product.findAll({
        attributes: {
          exclude: ['lastprice', 'createdAt', 'updatedAt']
        },
        where: { catid: category },
        order: [['id', 'ASC']]
      });
    }
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.post('/product', async (req, res) => {
  const { name, price, amount, catid, photoId, lastprice, description } = req.body;

  try {
    const existingProduct = await db.product.findOne({ where: { name } });

    if (existingProduct) {
      return res.status(409).send('Товар уже существует');
    }

    const newProduct = await db.product.create({ name, price, amount, catid, photoId, lastprice, description });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Ошибка сервера');
  }
});


app.post(
  "/photo/create",
  fileUploads({ tempFileDir: true }),
  (req, res) => {
    console.log(req)
    if (!req.files.photo) {
      res.send({ success: false });
      return;
    }

    const Id = "kkkk00" + ".jpg";


    const Path = path.join(
      __dirname,
      "..",
      "/img",
      Id
    );
    req.files.photo.mv(Path);
    console.log(path)

    const type = req.files.photo.mimetype;


    db.photo.create({ path: Path, type });



    res.send({ success: true, Id })
  }

);

app.get("/photo/:photoId", async (req, res) => {
  try {
    const id = +req.params.photoId || 0;
    console.log("photoId", id)
    const photo = await db.photo.findByPk(id);

    if (!photo) {
      res.sendStatus(404);
      return;
    }

    res.setHeader("Content-Type", photo.type);
    res.sendFile(photo.path);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const usersList = await db.user.findAll({
      include: [
        {
          model: db.role,
          through: {
            model: db.user_roles,
          },
        },
      ],
      order: [["id", "ASC"]],
    });
    res.json(usersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.user.findByPk(req.params.id);
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 часа
    });
    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/refreshRole/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    let { newRole } = req.body


    const user = await db.user.findOne({ where: { id: id } })
    const user_role = await db.user_roles.findOne({ where: { userId: id } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    if (newRole === user_role.roleId) {
      return res.send(`У пользователя уже роль ${user.role}`)
    }
    else {
      await db.user_roles.update({ roleId: newRole }, { where: { userId: id } })
    }

    return res.send(`Роль успенне изменена на ${newRole}`)

  } catch (e) {
    res.send(e.message)
  }
}
)

app.delete("/dropUser/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await db.user.findOne({ where: { id: id } })
    if (user) {
      await db.user.delete({ where: { userId: id } })
    }
    else {
      throw new Error()
    }

    return res.send(`Роль успенне изменена на ${newRole}`)

  } catch (e) {
    res.send(e.message)
  }
}
)


app.put("/newpass", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { username: req.body.username } });
    const naturalpass = await bcrypt.compare(req.body.password, user.password)
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    if (req.body.newpassword === req.body.password) {
      return res.status(500).send({ message: "Текущий пароль и новый пароль совпадают" });
    }
    const comparePass = () => {
      if (!naturalpass) {
        return false
      }
      else {
        return true
      }
    }
    if (comparePass()) {
      const hashpass = await bcrypt.hash(req.body.newpassword, 8)
      db.user.update({ password: hashpass }, { where: { username: req.body.username } })
      res.status(200).json({ message: "Пароль изменен" })
    } else {
      throw new Error()
    }
  }
  catch (error) {
    return res.status(500).send({ message: "Текущий пароль неверный" });
  }

})


app.use((err, req, res, next) => {
  console.error(err);
})

const PORT = process.env.PORT || 80;
db.sequelize.sync({ alter: true });

app.post("/activation", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    const compareCode = () => {
      if (user.activation_code === req.body.activation_code) {
        return true
      }
      else {
        return false
      }
    }
    if (compareCode()) {
      db.user.update({ activated: true }, { where: { email: req.body.email } })
      res.status(200).json({ message: "Аккаунт активирован" })
      db.user.update({ activation_code: null }, { where: { email: req.body.email } })
    } else {
      throw new Error()
    }
  } catch (error) {
    return res.status(500).send({ message: "Неверный код" });
  }
})
app.post("/reseting", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    const resetingCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' })
    } else {
      await db.user.update({ resetingCode: resetingCode }, { where: { email: req.body.email } })
      await MailService.sendResetingCode(req.body.email, resetingCode)
      return res.status(200).json({ message: 'Код для сброса установлен и отправлен на почту' })
    }
  } catch (error) {
    return res.status(500).send({ message: "Ошибка сервера" });
  }
})
app.post("/resetingverify", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw new Error()
    }
    if (user.resetingCode === req.body.resetingCode) {
      return res.status(200).send({ message: "Код совпал" })
    }
    else {
      throw new Error()
    }

  } catch (error) {
    return res.status(500).send({ message: "Неверный код" });
  }
})
app.put("/finishreset", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    console.log(user)
    const hashpass = await bcrypt.hash(req.body.newPassword, 8)
    console.log(hashpass)
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' })
    }

    const compareNewPass = () => {
      if (req.body.newPassword === req.body.newPasswordRepeat) {
        return true
      }
      else {
        return false
      }
    }
    if (!compareNewPass()) {
      return res.status(400).send({ message: "Пароли не совпадают" })
    }
    if (compareNewPass()) {
      await db.user.update({ password: hashpass }, { where: { email: req.body.email } })
      await MailService.sendPasswordReset(req.body.email)
      await db.user.update({ resetingCode: null }, { where: { email: req.body.email } })
      console.log('Письмо успешно отправлено');
      return res.status(200).json({ message: "Пароль восстановлен" })
    } else {
      throw new Error()
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Ошибка сервера" })
  }
});
app.post("/api/user/:username/activate/:activationCode", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    const compareCode = () => {
      if (user.activation_code === req.params.activationCode) {

        return true
      }
      else {
        return false
      }
    }
    if (compareCode()) {
      db.user.update({ activated: true }, { where: { username: req.params.username } })
      res.send(true)
    } else {
      throw new Error()
    }
  } catch (error) {
    return res.status(500).send('Ошибка сервера');
  }
})

app.post("/subscribing", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    const compareSubsc = () => {
      if (req.body.subscribed) {
        MailService.sendTestMail(req.body.email)
        return true
      }
      else {
        return false
      }
    }
    if (compareSubsc()) {
      db.user.update({ subscribed: true }, { where: { email: req.body.email } })
      res.status(200).json({ message: "Аккаунтподписан на рассылку" })
    } else {
      throw new Error()
    }
  } catch (error) {
    return res.status(500).send({ message: "Ошибка" });
  }
})

app.get("/issubscribing/:email", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }
    if (user.subscribed) {
      return res.status(200).json({ subscribed: true });
    } else {
      return res.status(200).json({ subscribed: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ошибка" });
  }
});

app.get("/isactiveemail/:email", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    if (user.activated) {
      return res.status(200).json({ message: 'активна' })
    }
    else {
      return res.status(404).json({ message: 'не активна' })
    }
  }

  catch (error) {
    return res.status(500).send({ message: "Ошибка" });
  }
})

app.post("/order", async (req, res) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const address = req.body.address;
    const delivery = req.body.delivery;
    const town = req.body.town;
    const productId = req.body.productId;
    const product = await db.product.findByPk(productId);
    const price = product.price;

    if (!product) {
      throw new Error(`Продукт с id ${productId} не найден`);
    }
    const order = await db.order.create({ userId: userId, price: price, productId: productId, name: name, address: address, status: "Оформлен", delivery: delivery, town: town });
    await db.product.update({ amount: product.amount - 1 }, { where: { id: productId } });
    return res.status(200).send(order)
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ошибка создания заказа" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(404).send('Пользователь не найден')
    }
    const orders = await db.order.findAll({ where: { userId: req.params.userId } });
    return res.json(orders);
  }

  catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Ошибка" });
  }
})



app.get("/cors/:userId", async (req, res) => {
  try {
    const cors = await db.cors.findOne({ where: { userId: req.params.userId } });

    if (cors) {
      const corsList = await db.cors.findOne({
        where: { id: cors.id },
        include: [{
          model: db.product,
          through: {
            model: db.cors_product,
          },
        }],
        order: [[db.product, 'id', 'ASC']]
      });
      console.log(corsList)
      if (corsList) {
        const products = corsList.products.map(product => product.toJSON());
        console.log(products);
        return res.json(products);
      } else {
        console.log('Корзина не найдена');
      }
    } else {
      console.log('Корзина не найдена');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ошибка" });
  }
});


app.put("/cors/amount", async (req, res) => {
  try {
    const newAmount = req.body.newAmount;
    const tovId = req.body.tovId;
    const userId = req.body.userId
    const cors = await db.cors.findOne({ where: { userId: userId } });
    if (!cors) {
      return res.status(404).send('Корзина не найдена')
    }
    else {
      await db.cors_product.update({ amount: newAmount }, { where: { productId: tovId, corsId: cors.id } })
    }
    return res.status(200).json({ message: "Успешно" })
  }
  catch (err) {
    return res.status(500).send({ message: "Ошибка" })
  }
})

app.delete("/cors/drop", async (req, res) => {
  try {
    const tovId = req.body.tovId;
    const userId = req.body.userId
    const cors = await db.cors.findOne({ where: { userId: userId } });
    if (!cors) {
      return res.status(404).send('Корзина не найдена')
    }
    else {
      await db.cors_product.destroy({ where: { productId: tovId, corsId: cors.id } })
    }
    return res.status(200).json({ message: "Успешно" })
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ message: "Ошибка" })

  }
})

app.post("/cors/add", async (req, res) => {
  try {
    const tovId = req.body.tovId;
    const userId = req.body.userId;
    const cors = await db.cors.findOne({ where: { userId: userId } });
    const product = await db.product.findOne({ where: { id: tovId } })
    if (!cors) {
      return res.status(404).send('Корзина не найдена');
    }
    const tovar = await db.cors_product.findOne({ where: { corsId: cors.id, productId: tovId } });
    if (tovar && tovar.amount === product.amount) {
      return res.status(400).send("Больше нельзя")
    }
    if (tovar) {
      await db.cors_product.update({ amount: tovar.amount + 1 }, { where: { productId: tovId, corsId: cors.id } });
    } else {
      await db.cors_product.create({ corsId: cors.id, productId: tovId, amount: 1 });
    }
    return res.status(200).json({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Ошибка" });
  }
});

app.post("/cors/check", async (req, res) => {
  try {
    const tovId = req.body.tovId;
    const userId = req.body.userId;
    const cors = await db.cors.findOne({ where: { userId: userId } });
    const product = await db.product.findOne({ where: { id: tovId } })
    const tovar = await db.cors_product.findOne({ where: { corsId: cors.id, productId: tovId } });
    if (!cors) {
      return res.status(404).send('Корзина не найдена');
    }

    if (tovar && tovar.amount === product.amount) {
      return res.status(400).send("Больше нельзя")
    }
    else {
      return res.status(200).json({ message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Ошибка" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

