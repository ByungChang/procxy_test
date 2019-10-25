<template>
    <v-dialog v-model="commentDialog" width="500">
        <v-card>
            <v-card-title 
            style="color:white;background-color:#230871"
            >
                댓글 수정
                <v-spacer></v-spacer>
                <v-icon 
                    dark
                    @click="modalClose()"
                >mdi-close
                </v-icon>
            </v-card-title>

            <v-card-text>
                <v-text-field
                    label="댓글 수정"
                    v-model="commentModify"
                    append-outer-icon="mdi-pencil"
                    @click:append-outer="modComment(item)"
                />
            </v-card-text>
        </v-card>
        <ErrorSnackBar></ErrorSnackBar>
    </v-dialog>
</template>
<script>
import axios from 'axios'
import eventBus from "./eventBus.js";
import ErrorSnackBar from './ErrorSnackBar.vue'

export default {
    data(){
        return{
            commentId:0,
            commentDialog:false,
            commentModify:'',
            commentSell:null,
            comments:[],
            alertText:'',
            alert:false
        }
    },
    mounted(){
        eventBus.$on('triggerAddCommentModal', (item) => { 
            this.commentModify = item.commentModify
            this.commentId = item.id
            this.commentModify = item.content //현재의 컨텐츠 내용
            this.commentSell = item
            this.commentDialog = true
        });
    },
    methods : {
        modComment()
        {
            this.commentSell.content = this.commentModify
            this.commentDialog=false

            axios.put('/api/board/comment', { 
                id: this.commentId,
                content: this.commentSell.content } 
            )
            .then((r) => {
                let i=0;
                
                // 이렇게 되는지 확인만 해줘요~~
                /*
                comments.array.forEach(comment => {
                    comment.id === this.commentId
                });
                */

                for(i=0;i<this.comments.length;i++){
                    if(this.comments[i].id === this.commentId){
                        this.comments[i].content = this.commentSell.content 
                    }
                }
            })
            .catch((e) => {
                eventBus.$emit('triggerError',true);
                console.error(e.message)
            })
        },
        modalClose(){
            this.commentModify = ''
            this.commentDialog = false
      },
    }
}
</script>