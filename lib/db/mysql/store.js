/**
 * Store
 *
 * This is the store file, where we keep the
 * actual DB syntax.
 *
 * @param {object} exports
 * @author Simon Emms <simon@simonemms.com>
 */


exports.createTable = function() {
    return "CREATE TABLE IF NOT EXISTS `currencyjs` (`currencyId` INT NOT NULL AUTO_INCREMENT, `currency` VARCHAR(3), `base` VARCHAR(3), `rate` DECIMAL(10,5) NOT NULL DEFAULT 0, `date` DATE, PRIMARY KEY (`currencyId`)) ENGINE=INNODB CHARSET=latin1;";
};

exports.currencyIsPresent = function() {
    return "SELECT * FROM `currencyjs` WHERE `currency` = ? AND `base` = ? AND `date` = ?";
};

exports.getAllCurrencies = function() {
    return "SELECT `currency` FROM `currencyjs` GROUP BY `currency` UNION SELECT `base` AS `currency` FROM `currencyjs` GROUP BY `currency` ORDER BY `currency` ASC";
};

exports.getMaxDate = function() {
    return "SELECT * FROM `currencyjs` WHERE `date` <= ? AND `currency` = ? LIMIT 1";
};

exports.insertData = function() {
    return "INSERT INTO `currencyjs` (`currency`, `base`, `rate`, `date`) VALUES ?";
};