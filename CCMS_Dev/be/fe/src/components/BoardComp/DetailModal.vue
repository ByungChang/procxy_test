<template>
    <v-dialog
      v-model="DModal"
      width="800px"
      persistent
    >
        <ConfirmSnackBar></ConfirmSnackBar>

        <v-card>
            <v-system-bar window dark>
                <span>작성일 : {{form.createdAt}}</span>
                <v-spacer></v-spacer>

                <v-icon v-if="user === form.writer"
                    small
                    class="mr-2"
                    @click="openEditModal(form)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon v-if="user === form.writer"
                    small
                    @click="deletePost(form)"
                >
                    mdi-delete
                </v-icon>
            <v-btn icon dark>
                <v-icon @click="DModalClose">mdi-close</v-icon>
            </v-btn>
            </v-system-bar>
        
            <v-card-title 
            style="color:white;background-color:#230871">{{form.title}}
            </v-card-title>
            
            <v-container
                class="overflow-y-auto"
                style="max-height: 500px"
                id="scroll-target"
            >
                <v-layout wrap row>
                    <v-flex>
                        <viewer  :value="form.content" style="min-height:300px;"  class="ma-4"></viewer>
                        <v-divider style="background-color:#000000" ></v-divider>
                        <v-list three-line>
                            <v-list-item
                                v-for="item in comments"
                                :key="item.id"
                                style="border-bottom:1px grey dashed"
                            >
                                <v-list-item-avatar>
                                <v-icon size="80"> mdi-account-circle</v-icon>
                                </v-list-item-avatar>
                        
                                <v-list-item-title>
                                    <strong>{{item.user.userNm}}</strong> {{item.createdAt}}<!--item.title-->
                                    <v-list-item-content>{{item.content}} </v-list-item-content>
                                </v-list-item-title>

                                <v-icon v-if="user === item.user.userNm"
                                    @click="modCommentDialog(item)"
                                    small
                                    >mdi-pencil
                                </v-icon>
                            
                                <v-icon v-if="user === item.user.userNm"
                                    small
                                    right
                                    @click="deleteComment(item)"
                                >mdi-delete
                                </v-icon>
                            </v-list-item>
                        </v-list>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-container>
                <v-text-field
                    v-model="commentAdd"
                    label="댓글 작성"
                    append-outer-icon="mdi-send"
                    @click:append-outer="addComment"
                ></v-text-field>
            </v-container>
        </v-card>
        <ErrorSnackBar></ErrorSnackBar>
    </v-dialog>
</template>
<script>
    import axios from 'axios'
    import ConfirmSnackBar from './ConfirmSnackBar.vue'
    import ErrorSnackBar from './ErrorSnackBar.vue'
    import eventBus from "./eventBus.js";

    export default {
        mounted()  {
            var self = this;
            this.user = localStorage.getItem('user')
            this.id = localStorage.getItem('id')
            eventBus.$on('triggerDModal', (boardId,form,comments) => { 
                this.boardId = boardId
                this.form = form
                this.comments = comments
                this.DModal = true
            });

            eventBus.$on('triggerDelCommentOk', (comments) => { 
                this.comments = comments
            });
        },
        data () {
            return {
                id:0,
                DModal:false,
                confirmComment:false,
                confirmCommentText:'',
                flag:'',
                form: {
                    id:1,
                    title: '',
                    writer:'',
                    content: '',
                    createdAt:''
                },
                comments:[],
                commentAdd:"",
                user:'',
                commentId:0,
                commentDialog: false, //두번째 수정하기창
                commentModify:'',
                commentSell:null,
                confirm:false,
                boardId:0,
            }
        },
        methods : {
            DModalClose(){
                this.form.title = ''
                this.form.content = ''
                this.DModal = false
            },
            UModalClose(){
                this.form.title = ''
                this.form.content = ''
                this.UModal = false
            },
            modCommentDialog (cmt) {
                this.commentDialog = true
                this.commentId = cmt.id
                this.commentModify = cmt.content //현재의 컨텐츠 내용
                this.commentSell = cmt
                eventBus.$emit('triggerAddCommentModal',cmt);
            },
            addComment()
            {
                axios.post('/api/board/comment/add', {
                    boardId:this.boardId,
                    userId:this.id,
                    content:this.commentAdd,
                })
                .then((r) => {
                    console.log(r.data.comment)
                    var temp = {
                        id:1,
                        orgId:1,
                        userGroupId:1,
                        userNm:this.user,
                        userPw:'',
                        userYn:'',
                        boardId:1,
                        content:'',
                        createdAt:'',
                        id:0,
                        }
                    const comment = {
                        content: this.commentAdd,
                        boardId: this.boardId,
                        id: r.data.comment.id,
                        user:temp,
                        createdAt:'New'
                    }
                    console.log(comment)
                    this.comments.push(comment)
                    this.commentAdd=''
                })
                .catch((e) => {
                    eventBus.$emit('triggerError',true);
                    console.error(e.message)
                })
            },
            deleteComment(item){
                eventBus.$emit('triggerDelComment',item.id,this.comments);
            },
            deletePost (item) {
                eventBus.$emit('triggerDelPost',item.id);
            },
            openEditModal(item){
                this.DModal = false
                eventBus.$emit('triggerEditModal',item);
            },
        },
        components:{
            'ConfirmSnackBar':ConfirmSnackBar
        }    
    }
</script>