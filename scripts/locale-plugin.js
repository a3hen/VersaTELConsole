/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const fs = require('fs')
const path = require('path')
const RawSource = require('webpack-sources/lib/RawSource')
const langArr = fs.readdirSync(`./locales/`)

const isDev = process.env.NODE_ENV === 'development'

class LocalePlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('LocalePlugin', compilation => {
      const assets = compilation.getAssets()
      assets.forEach(asset => {
        let content = asset.source.source()
        try {
          const obj = eval(content)
          if (obj.default) {
            content = JSON.stringify(
              obj.default.reduce((prev, cur) => ({ ...prev, ...cur }), {})
            )
          }

          if (isDev) {
            if (!fs.existsSync(compiler.outputPath)) {
              fs.mkdirSync(compiler.outputPath)
            }
            fs.writeFileSync(
              path.join(compiler.outputPath, asset.name),
              content
            )
          }
        } catch (error) {}

        compilation.updateAsset(asset.name, new RawSource(content))
      })
      langArr.forEach(lang => {
        only(lang)
      })
    })
  }
}

function read(lang) {
  const files = fs.readdirSync(`locales/${lang}`)
  return files
}

function only(lang) {
  const files = read(lang)

  const allKeyArr = []
  files.forEach(file => {
    if (file === 'index.js') {
      return
    }
    const fileObj = require(`../locales/${lang}/${file}`)
    Object.keys(fileObj).forEach(key => {
      if (allKeyArr.indexOf(key) > -1) {
        (lang, '语言环境下重复UI词条为:', key)
      } else {
        allKeyArr.push(key)
      }
    })
  })
}

module.exports = LocalePlugin
