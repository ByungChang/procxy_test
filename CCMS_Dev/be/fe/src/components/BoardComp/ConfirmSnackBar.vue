<template>
    <v-snackbar
        :timeout=10000
        v-model="confirm"
        top
        multi-line
        persistent
        color="error"
        dark
        icon="mdi-alert-circle-outline"
        transition="scale-transition"
      >정말 삭제 하시겠습니까?
        <v-btn flat  color="error"  @click="confirmYes">네</v-btn>
        <v-btn flat  color="error"  @click="confirmNo">아니요</v-btn>
    </v-snackbar>
</template>
<script>
import axios from 'axios'
import eventBus from "./eventBus.js";

export default {
    data(){
        return{
            confirm:false,
            comentId:0,
            comments:[],
            alertText:'',
            alert:false,
            CommentORPost:''
        }
    },
    mounted(){
        eventBus.$on('triggerDelComment', (item,comments) => { 
            this.commentId = item
            this.comments = comments
            this.confirm = true
            this.CommentORPost = 'Comment'
        });
        eventBus.$on('triggerDelPost', (item) => { 
            this.boardId = item
            this.confirm = true
            this.CommentORPost = 'Post'
        });
    },
    methods : {
        confirmYes(){
            if(this.CommentORPost === 'Comment'){
                axios.delete('/api/board/comment', 
                {
                    data: { id: this.commentId } 
                })
                .then((r) => {
                    let i=0;
                    for(i=0;i<this.comments.length;i++){
                        if(this.comments[i].id === this.commentId){
                            this.comments.splice(i,1)
                        }
                    }
                    this.confirm = false
                    eventBus.$emit('triggerDelCommentOk',this.comments);
                })
                .catch((e) => {
                    this.alertText='에러가 발생했습니다'
                    this.alert=true
                    console.error(e.message)
                })
            }
            else if(this.CommentORPost === 'Post'){
                axios.delete('/api/board', 
                {
                    data: { id: this.boardId } 
                })
                .then((r) => {
                    //location.href = '/api/board'
                    axios.get('/api/board', {})
                })
                .catch((e) => {
                    this.alertText='에러가 발생했습니다'
                    this.alert=true
                    console.error(e.message)
                })
            }
        },
        confirmNo(){
            this.confirm=false
        },
    }
}
</script>