const Telegraf = require('telegraf');

const env = require('dotenv').config();

const geocode = require('./geocode');
const weather = require('./weather');

let bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome to weather bot'))
bot.help((ctx) => ctx.reply('Weather Bot | send an address to bot, give your weather temperature '))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.on('text', (ctx) => {

	let address = ctx.message.text;
	let foundedAddress = '';

	//get geocode
	geocode.geocodeAddress(address)
		.then(response => {
			foundedAddress = response.address;

			//get weather
			return weather.getWeather(response.latitude,response.longitude)
		})
		.then(response=>{
			
			//Persian response message
			let message = `
			آدرس پیدا شده: ${foundedAddress}
			الان دما ${response.temperature} درجه است. 
			ولی تا ساعات آینده به  ${response.apparentTemperature} .درجه می رسد
			`;

			return ctx.reply(message);
		})
		.catch(error => {
			console.log(error);
		})
})

bot.launch()


