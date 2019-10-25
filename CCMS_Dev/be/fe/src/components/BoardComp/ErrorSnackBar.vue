<template>
    <v-snackbar
        :timeout='false'
        v-model="alert"
        top
        persistent
        multi-line
        color="blue lighten-2"
        dark
        icon="mdi-alert-circle-outline"
        transition="scale-transition"
    >에러가 발생했습니다
    <v-btn flat  color="blue lighten-2"  @click="alertConfirm">확인</v-btn>
    </v-snackbar>
</template>
<script>
import eventBus from "./eventBus.js";

export default {
    data() {
        return{
            alert:false
        }
    },
    mounted() {
        eventBus.$on('triggerError', (item) => { 
          this.alert = true
        });
    },
    methods :{
        alertConfirm(){
            //location.herf = '/board'
            axios.get('/api/board', {})
        }
    }
}
</script>