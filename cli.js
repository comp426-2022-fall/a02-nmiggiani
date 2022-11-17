#!/usr/bin/env node


import fetch from "node-fetch";
import minimist from "minimist";
import moment from "moment-timezone";

const args = minimist(process.argv.slice(2));


if (args.h) {
  console.log(`
  Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
  -h            Show this help message and exit.
  -n, -s        Latitude: N positive; S negative.
  -e, -w        Longitude: E positive; W negative.
  -z            Time zone: uses tz.guess() from moment-timezone by default.
  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
  -j            Echo pretty JSON from open-meteo API and exit.
`)
process.exitCode = 0;
}

// timezone
var timezone = moment.tz.guess();

// latitude and longitude
var latitude;
var longitude;

if (args.n) {
	latitude = args.n;
}
if (args.s) {
	latitude = args.s * -1;
}
if (args.w) {
	longitude = args.w * -1;
}
if (args.e) {
	longitude = args.e;
}
if (args.t) {
    timezone = args.t;
}
timezone.replace("/", "%2");

if(!latitude) {
	console.log("Latitude in range");
	process.exit(0);
} else if (!longitude) {
	console.log("Longitude in range");
	process.exit(0);
}


const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);

const data = await response.json();

if (args.j) {
	console.log(data);
	process.exit(0);
}

const days = args.d;

if (data.daily.precipitation_hours[days] == 0) {
	console.log("You will not need your galoshes")
} else {
	console.log("You might need your galoshes")
}
if (days == 0) {
	console.log("today.")
} else if (days > 1) {
    console.log(" in " + days + "days.")
} else {
    console.log("tomorrow.")
}
process.exit(0);