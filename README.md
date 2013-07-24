# CurrencyJS [![Travis-CI](https://api.travis-ci.org/riggerthegeek/currencyjs.png)](https://travis-ci.org/riggerthegeek/currencyjs/builds)

A free currency converter for NodeJS - uses the European Central Bank's daily
feed for accuracy

# Contents

 * [Installation](#installation)
 * [Usage](#usage)
  * [Creating Data Tables](#creatingdatatables)
  * [Importing Data](#importingdata)
  * [Converting Currencies](#convertingcurrencies)
  * [The Convert Model](#theconvertmodel)
 * [Supported Currencies](#supporedcurrencies)
 * [Supported Databases](#supporteddatabases)
 * [Bugs](#bugs)
 * [Licence](#licence)

<a name="installation" />
# Installation

The best way of installing this is through [NPM](https://npmjs.org/package/currencyjs):

    npm install currencyjs

If you want to install a specific version:

    npm install currencyjs@1.0.0

<a name="usage" />
# Usage

The first thing you need to do is to include the library and create an instance.

    var CurrencyJS = require('currencyjs');
    
    var objCurrency = new CurrencyJS({
        type: 'mysql', // Select database to use
        host: 'host', // localhost or similar
        user: 'username', // Optional
        pass: 'password', // Optional
        db: 'database',
        port: 'port' // Optional
    });

See the [Supported Databases](#supporteddatabases) section for the databases you
can use.

<a name="creatingdatatables" />
## Creating Data Tables

Once you've created your instance, you will need to create your data table.  This
is something you'll only probably do once, but it's written as a function to make
it easier (and to run integration tests on it).

Depending upon your chosen database type (eg, Mongo), you may not actually need
to run this.  However, it's probably best to run it.

    objCurrency.createTable(function(err, result) {
        
        // err should be null
        // result should be true
        
    });

If you have some form of migration script of your own, you can use the actual
query directly.  You'll find this in */lib/db/DB_TYPE/store.js*.

<a name="importingdata" />
## Importing Data

Now we've got our data table created, we can start importing some data.  The
feed is from the European Central Bank, which publishes it in XML format.  Again
there is a method that you can execute, imaginatively titled _import()_.

    objCurrency.import(function(err, importCount) {
        
        // err should be null
        // importCount should be a number, at least 0
        
    });

This is probably best run as a cron job. The feed gets updates at about 2pm in
Central European Time - UTC + 1 (UTC + 2 in the summer).  Also, the feed is only
updated on weekdays, so not much point in querying it on a Saturday or Sunday.

<a name="convertingcurrencies" />
## Converting Currencies

This is what you actually want.  Once you've set up your database and imported
some data, you can actually get on with doing the conversions.  Best done with
a series of examples

### Get 1 USD in EUR at latest rate

Pass in just the currencies to get the currency rate

    objCurrency.convert('USD', 'EUR', function(err, objConvert) {
        
        // err should be null
        // objConvert should be instance of Convert object
        
    });

### Get 10 GBP in AUD at latest rate

Pass in an object with _value_ defined.  __THIS MUST BE A NUMBER__

    objCurrency.convert('GBP', 'AUD', {value: 10}, function(err, objConvert) {
        
        // err should be null
        // objConvert should be instance of Convert object
        
    });

### Get 45.85 EUR in CAD for a given date

Pass in an object with _date_ defined.  __THIS MUST BE A DATE OBJECT__

    objCurrency.convert('EUR', 'CAD', {value: 45.85, date: new Date('2013-07-23')}, function(err, objConvert) {
        
        // err should be null
        // objConvert should be instance of Convert object
        
    });

<a name="theconvertmodel" />
## The Convert Model

When you make a conversion request, you are returned an instance of the Convert
model.  This is quite useful as, once you have it, you can make further conversions
without having to query the database.

### Methods Available

#### calculate(value)
_@returns Undefined_

Converts the _from_ value into the _to_ value

You will need to do one of the below get methods to return the value.

#### calculateReverse(value)
_@returns Undefined_

Converts the _to_ value into the _from_ value

You will need to do one of the below get methods to return the value.

#### getFromFormatted(decimals = 2, decPoint = '.', thousandsSep = ',')

Gets the _from_ value formatted as a string.  By default, it would return 1234.5
as _1,234.50_.

#### getFromValue()
_@returns Number_

Returns the _from_ value as a number.

#### getRate()
_@returns Number_

Returns the converstion rate as a number.  Multiply the _from_ value by this
and you will get the _to_ value.

#### getReverseRate()
_@returns Number_

Returns the reverse converstion rate as a number.  Multiply the _to_ value by
this and you will get the _from_ value.

#### getToFormatted(decimals = 2, decPoint = '.', thousandsSep = ',')
_@returns String_

Gets the _to_ value formatted as a string.  By default, it would return 1234.5
as _1,234.50_.

#### getToValue()
_@returns Number_

Returns the _to_ value as a number.

<a name="supporedcurrencies" />
# Supported Currencies

This is a list of all the supported currencies and their 3 letter code:

 * AUD - Australian Dollar
 * BGN - Bulgarian Lev
 * BRL - Brazilian Real
 * CAD - Canadian Dollar
 * CHF - Swiss Franc
 * CNY - Chinese Yuan
 * CZK - Czech Koruna
 * DKK - Danish Krone
 * EUR - Euro
 * GBP - British Pound
 * HKD - Hong Kong Dollar
 * HRK - Croatian Kuna
 * HUF - Hungarian Forint
 * IDR - Indonesian Rupiah
 * ILS - Israeli New Shekel
 * INR - Indian Rupee
 * JPY - Japanese Yen
 * KRW - South Korean Won
 * LTL - Lithuanian Litas
 * LVL - Latvian Lats
 * MXN - Mexian Peso
 * MYR - Malaysian Ringgit
 * NOK - Norwegian Krone
 * NZD - New Zealand Dollar
 * PHP - Phillippine Peso
 * PLN - Polish Zloty
 * RON - Romanian New Leu
 * RUB - Russian Rouble
 * SEK - Swedish Krona
 * SGD - Singapore Dollar
 * THB - Thai Baht
 * TRY - Turkish Lira
 * USD - US Dollar
 * ZAR - South African Rand

<a name="supporteddatabases" />
# Supported Databases

CurrencyJS supports the following databases and from which version.  Simply set
up the CurrencyJS object with the _string in italics_ below.

 * MySQL (v1.0.0) - _mysql_
 * MongoDB (v1.1.0) - _mongo_

<a name="bugs" />
# Bugs

Please report any bugs on [GitHub](https://github.com/riggerthegeek/currencyjs/issues)

<a name="licence" />
# Licence

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.

Copyright (C) 2013 [Simon Emms](https://github.com/riggerthegeek)
