<template>
    <v-data-table
        :headers="headers"
        :items="posts"
        :search="search"
        :page.sync="page"
        :items-per-page="12"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"  
        style="border-top:1px black solid;border-bottom:1px black solid"
    >   
        <template v-slot:item.updatedAt="props">
            <v-chip :color="getColor(props.item.board_post.name)" dark>  {{props.item.board_post.name}} </v-chip>
        </template>
        
        <template v-slot:item.title="props">
            <a @click="boardDetail(props.item)" style="color:black;text-align:left;display:block;">
                {{props.item.title}}
            </a>
        </template>

    </v-data-table>
</template>

<script>
    import axios from 'axios'
    import BoardTable from './BoardTable.vue'
    import DetailModal from './DetailModal.vue'
    import eventBus from "./eventBus.js";


    export default {
        mounted () {
            const token = localStorage.token
            this.user = localStorage.getItem('user')
            this.id = localStorage.getItem('id')
            axios.get('/api/board', {
                //headers: { Authorization: token },
        })
        .then((r) => {
            console.log(r)
            let j=0;
            for(j=0;j<r.data.posts.length;j++){
                var y = r.data.posts[j].createdAt.substr(0, 4);
                var m = r.data.posts[j].createdAt.substr(5, 2);
                var d = r.data.posts[j].createdAt.substr(8, 2);
                var h = r.data.posts[j].createdAt.substr(11, 2);
                var min = r.data.posts[j].createdAt.substr(14, 2);
                var s = r.data.posts[j].createdAt.substr(17, 2);
                var temp = y+'-'+m+'-'+d+' '+h+':'+min+':'+s


                var diffDate_1 = temp instanceof Date ? temp :new Date(temp);
                var diffDate_2 = new Date();
            
                diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
                diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
            
                var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
                diff = Math.ceil(diff / (1000 * 3600 * 24));

                if(diff<1)
                    r.data.posts[j].createdAt = h+':'+min+':'+s
                else
                    r.data.posts[j].createdAt = y+'-'+m+'-'+d +' '+h+':'+min+':'+s
                }
                
                this.posts = r.data.posts
                this.posts.reverse()
                this.posts.sort(function (a, b) { 
                return a.board_post.name < b.board_post.name ? -1 : 1;  
            });
            console.log(this.posts)
        })
        .catch((e) => {
            console.error(e.message)
        })
        },
        data () {
            return {
                id:0,
                headers: [
                    { width:'100px', text: '말머리', sortable: false, value: 'updatedAt', align: 'center'},
                    { text: '번호', value: 'id' , align: 'center', sortable: false},
                    { text: '제목', align: 'center', sortable: false, value: 'title'},
                    { text: '작성자', value: 'user.userNm' , align: 'center', sortable: false},
                    { text: '작성일', value: 'createdAt' , align: 'center', sortable: false},
                    { text: '조회수', value: 'hit', sortable: false , align: 'center'},
                ],
                posts: [],
                boardId:1,
                form: {
                    id:1,
                    title: '',
                    writer:'',
                    content: '',
                    createdAt:''
                },
                comments:[],
            }
        },
        methods:{
            getColor (item) {
                console.log('겟컬러')
                if (item === '공지') return 'red'
                    else return 'grey'
            },
            boardDetail(item){
                item.hit= item.hit+1
                this.boardId = item.id
                this.form.id = item.id
                this.form.title = item.title
                this.form.writer = item.user.userNm
                this.form.content = item.content

                if(item.createdAt.length < 10){
                    var today = new Date()
                    this.form.createdAt = today.getFullYear()+'-'+(today.getMonth()+1)+'-' +today.getDate()+' '+ item.createdAt
                }
                else
                    this.form.createdAt = item.createdAt
                axios.post('/api/board/comment', {
                    boardId: item.id,
                    hit: item.hit
                })
                .then((r) => {
                    console.log('dfdf')
                    let j=0;
                    console.log(r)
                    for(j=0;j<r.data.comments.length;j++){
                        var y = r.data.comments[j].createdAt.substr(0, 4);
                        var m = r.data.comments[j].createdAt.substr(5, 2);
                        var d = r.data.comments[j].createdAt.substr(8, 2);
                        var h = r.data.comments[j].createdAt.substr(11, 2);
                        var min = r.data.comments[j].createdAt.substr(14, 2);
                        var s = r.data.comments[j].createdAt.substr(17, 2);
                        var temp = y+'-'+m+'-'+d+' '+h+':'+min+':'+s
                        r.data.comments[j].createdAt=temp
                    }
                    this.comments = r.data.comments
                    eventBus.$emit('triggerDModal',this.boardId,this.form,this.comments);
                    })
                .catch((e) => {
                    console.error(e.message)
                })
            },
        },
        components:{
            'DetailModal' : DetailModal
        } 
    }
</script>