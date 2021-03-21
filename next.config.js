/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
require('dotenv').config();

module.exports = {
  assetPrefix: process.env.GITHUB_PAGES ? '/nests' : '',
};
