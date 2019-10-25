module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
        '/api': {
            target: 'http://192.168.0.201:3000/api' // 개발서버
        }
    }
  }
}
