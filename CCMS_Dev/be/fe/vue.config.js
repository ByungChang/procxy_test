module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000/api' // 개발서버
        }
    }
  }
}
