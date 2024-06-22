const TelegramBot = require('node-telegram-bot-api');
// var subdomain = require('express-subdomain');
const express = require('express');
// const vhost = require('vhost');
const cors = require('cors');


const token = '7021506819:AAEvC0OnKlVn8m2mdcGZbJYFY0ARr6mr-ZQ';

const webAppUrl = "https://bot.maz-manipulator.by/";

const bot = new TelegramBot(token, { polling: true });

const app = express();
// const domain1App = express();
var router = express.Router();
app.use(express.json());
app.use(cors());

app.get('/', function(req, res) {
  res.send('Welcome to our API!');
});

app.get('/users', function(req, res) {
  res.json([
    { name: "Brian" }
  ]);
});
app.post('/user', function(req, res) {
  res.json([
    { name: "Brian" }
  ]);
});


// app.use(vhost('botshop.maz-manipulator.by', domain1App));

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
 
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === "/start"){
    await bot.sendMessage(chatId, 'Включаю кнопку снизу',{
      reply_markup:{
        keyboard:[
          [{text:'Кнопка снизу',web_app:{url:webAppUrl + 'form'}}]
        ]
      }
    })
  }

  await bot.sendMessage(chatId, 'Включаю кнопку в чате',{
    reply_markup:{
      inline_keyboard:[
        [{text:'Заполнить форму',web_app:{url:webAppUrl}}]
      ]
    }
  })

  if(msg?.web_app_data?.data){
    await bot.sendMessage(chatId, "отправлено из формы")
    try{
      const data = JSON.parse(msg?.web_app_data?.data)
  
      // await bot.sendMessage(chatId, data)
      await bot.sendMessage(chatId, "eto" + data?.country)
      await bot.sendMessage(chatId, data?.firstname)
      await bot.sendMessage(chatId, data?.lico)

    }catch (e){
      console.log('====================================');
      console.log(e);
      console.log('====================================');
    }
   }

});

app.post('/web-data', async(req,res) =>{
const {queryId, products, totalPrice} = req.body;
try{
  // await bot.answerWebAppQuery(queryId,{
  //   type:'article',
  //   id:queryId,
  //   title: 'Успешная покупка',
  //   input_message_cntent:{message_text:'Поздравляю с покупкой, товар на сумму ' + totalPrice}
  // })
  
  return res.status(200).json([{
    type:'article',
    id:queryId,
    title: 'Успешная покупка'
  }]);

}catch(e){
  // await bot.answerWebAppQuery(queryId,{
  //   type:'article',
  //   id:queryId,
  //   title: 'Ошибочка',
  //   input_message_cntent:{message_text:e}
  // })
  return res.status(500).json(JSON.stringify({
    type:'article',
    id:queryId,
    title: 'Успешная покупка',
    input_message_cntent:{message_text:'Поздравляю с покупкой, товар на сумму ' + totalPrice}
  }));
}
})
app.get('/hi', async (req, res) => {
  return res.status(201).json([req]);
 })
const PORT = 8000;
app.listen(PORT)