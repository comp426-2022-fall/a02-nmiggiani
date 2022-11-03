#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';


const args = minimist(process.argv.slice(2))
console.log(args)

if (args.h) {
  try {
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
      
  }catch(err){
      process.exitCode = 1;
  }
}

// Set Latitude & Longitude
const latitude = (args.n || (args.s * -1))
const longitude = (args.e || (args.w * -1))

// Check/Set Timezone
const time_zone = moment.tz.guess();

// Checking Day
const day = 1
if (args.d != null) {
  day = args.d
}

// Make Request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&temperature_unit=fahrenheit&timezone=' + time_zone);

const data = await response.json();

if (args.j) {
  console.log(data);

  process.exit(0);
}

console.log('you');

if (data.daily.precipitation_hours[day] > 0) {
  console.log('get the weather gear')
}
else {
  console.log('have a picnic')
}

if (day == 0) {
  console.log("today.")
} else if (day > 1) {
  console.log("in " + day + " days.")
} else {
  console.log("tomorrow.")
}