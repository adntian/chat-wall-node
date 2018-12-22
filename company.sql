/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : company

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2018-12-22 22:50:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeid` varchar(11) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sign` int(10) DEFAULT '0' COMMENT ';0-1-',
  `nickName` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(1024) DEFAULT NULL,
  `gender` int(10) DEFAULT NULL COMMENT '0-1-',
  `openId` varchar(255) DEFAULT NULL COMMENT 'openid',
  `updatetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `signMessage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8;
