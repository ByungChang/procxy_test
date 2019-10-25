<template>
  <v-card>   
    <v-card-title>
      게시판
      <v-spacer></v-spacer>
      <v-text-field 
        v-model="search"
        append-icon="mdi-magnify"
        label="검색어입력"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-snackbar
      :timeout=10000
      v-model="confirm_"
      top
      multi-line
      color="error"
      dark
      icon="mdi-alert-circle-outline"
      transition="scale-transition"
    >
      {{confirmText}}
      <v-btn color="error"  @click="confirmYes(item)">네</v-btn>
      <v-btn color="error"  @click="confirmNo">아니요</v-btn>
    </v-snackbar>

    <BoardTable></BoardTable>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <v-btn
      bottom
      color="purple darken-4"
      dark
      fab
      fixed
      right
      @click="openAddModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <DetailModal></DetailModal>

    <WritePostModal></WritePostModal>
    
    <AddCommentModal></AddCommentModal>
  </v-card>
</template>

<script>
  import BoardTable from '../components/BoardComp/BoardTable.vue'
  import DetailModal from '../components/BoardComp/DetailModal.vue'
  import AddCommentModal from '../components/BoardComp/AddCommentModal.vue'
  import WritePostModal from '../components/BoardComp/WritePostModal.vue'
  import eventBus from "../components/BoardComp/eventBus.js";

  export default {
    props: {
      source: String,
    },
    data () {
      return {
        totalItem:0,
        valid:true,
        alertText:'',
        confirmText:'',
        confirmCommentText:'',
        general:'',
        catagory:'',
        id:'',
        name:'',
        boardId:0,
        snackbar: false,
        timeout: 999,
        dialog: false,
        dialog2: false,
        flag:'post',
        alert: false,
        confirm_: false,
        confirmComment: false,
        page: 1,
        pageCount: 0,
        search: '',
        postCreateLink:[
          {
            to: {path: '/board/create'}
          }
        ],
        getMd: '',
        
        form: {
          id:1,
          title: '',
          writer:'',
          content: '',
          createdAt:''
        },
        titleRules: [
            v => !!v || '제목을 입력해주세요',
        ],
        
        copyPosts:[],
        posts: [],
      }
    },
    methods: 
    {
      openAddModal(){
        eventBus.$emit('triggerAddModal','add');
      },
      
      modalClose2(){
        this.form.title = ''
        this.form.content = ''
        this.comments = []
        this.dialog2 = false
      },
      
      isNew(item){
        var diffDate_1 = item.createdAt instanceof Date ? item.createdAt :new Date(item.createdAt);
        var diffDate_2 = new Date();
    
        diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
        diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
    
        var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));

        if(diff<3 || isNaN(diff)){
          return true
        }
        else{
          return false
        }
      },
      
    },
  components:{
    'BoardTable' : BoardTable,
    'DetailModal' : DetailModal,
    'AddCommentModal' : AddCommentModal,
    'WritePostModal' : WritePostModal,
  }
 }
</script>
<style scoped>

#board
{
  color : white
}

</style>