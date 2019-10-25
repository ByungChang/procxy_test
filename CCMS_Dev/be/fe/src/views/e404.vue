<template>
  <v-card>   
    <v-card-title>
      게시판
      <v-spacer></v-spacer>
      <v-text-field 
        v-model="search"
        append-icon="mdi-heart"
        label="검색어입력"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    

    <v-data-table  
      
     
      :headers="headers"
      :items="posts"
      :search="search"
      :page.sync="page"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"  
    >
<!--  말머리!-->
      <template v-slot:item.error="{ item }">
      <v-chip :color="getColor(item.error)" :text="gettext(item.error)" dark>  {{item.error}} </v-chip>
    </template>
<!-- 말머리 !-->

<!--  말머리!-->
      <template v-slot:item.title="{ item }" >
      <v-icon> mdi-alpha-n  </v-icon>
    </template>
<!-- 말머리 !-->

      <template  v-slot:item.title="props">
        <v-edit-dialog 
          :return-value.sync="props.item.title"
          
          @open="open"
          @click="boardDetail"
        >      
          
        <v-list-item>
          <v-list-item-content>
            
            <v-list-item-title   @click="boardDetail(props.item)">{{props.item.title}}
<!-- 주석 아이콘 -->
               <v-icon color="red"> mdi-alpha-n  </v-icon>

<!-- 주석 아이콘 -->
            </v-list-item-title>
           
          </v-list-item-content>
        </v-list-item>
          
        </v-edit-dialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="openEditModal(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deletePost(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <v-btn
      bottom
      color="blue-grey"
      dark
      fab
      fixed
      right
      @click="openAddModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog2"
      width="800px"
      persistent
    >
      <v-card>
          <v-card-title 
      style="color:white;background-color:#230871">게시글
      <v-spacer></v-spacer>
      <v-btn 
      icon
      dark>
        <v-icon 
        @click="modalClose2"
        size="30px">mdi-close</v-icon>
      </v-btn>
        </v-card-title>
          <v-container
          
          class="overflow-y-auto"
         style="max-height:600px"
         >
        <v-list-item-title  style="border-bottom:1px grey dashed">
         제목: {{form.title}}
        </v-list-item-title>
       <!-- 주석 점선 -->
        <v-list-item-content style="rows:400px" align-items: baseline>
         
         
        <!--<viewer value="asdasd"></viewer>-->
          </v-list-item-content>
      
      
         <v-list
          three-line
          style="border-top:1px grey solid"
         >
       <v-list-item
       style="border-bottom:1px grey dashed"
        v-for="item in comments"
        :key="item._id"
       >
        <v-list-item-avatar>
          <v-icon> mdi-account-circle</v-icon>
        </v-list-item-avatar>
 
          <!-- 주석 점선 -->
        <v-list-item-content>
          <v-list-item-title v-text="item.content"></v-list-item-title>
          <v-list-item-subtitle v-text="item.user"> 
                    
          </v-list-item-subtitle>
            <v-list-item-subtitle v-text="item.user">                   
          </v-list-item-subtitle>
        </v-list-item-content>

            <v-icon color="grey lighten-1" @click="modCommentDialog(item)"
             small
            @click:append-outer="addComment"
             >mdi-pencil
             </v-icon>
          
            <v-icon
             small
             right
              @click:append-outer="addComment"
             >mdi-delete
             </v-icon>
       
      </v-list-item>
    </v-list>
     <v-text-field
            v-model="commentAdd"
             label="댓글 작성"
            append-outer-icon="mdi-send"
            @click:append-outer="addComment"
          
></v-text-field>
          </v-container>
       
 
<!-- 댓글쓰기란!-->

<!-- 댓글!-->
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      width="800px"
      persistent
    >
      <v-card>
        <v-card-title class="blue-grey">
          <p class=font-weight-black id=board> 게시판 </p>
        </v-card-title>
          <v-row 
          class="ma-0"
          > 
            <v-col
              class="align-center justify-space-between"
              cols="12"
            >
              <v-row align="center">
                <v-avatar
                  size="40px"
                  class="mr-4"
                >
                <p class=font-weight-black > 제목 </p>
                </v-avatar>
                <v-text-field
                   placeholder="제목을 입력해주세요" 
                   v-model="form.title"
                ></v-text-field>
              </v-row>
            </v-col>
            
            <v-container>
              <v-alert type="info" :value="true">
                내용
              </v-alert>
              <editor v-model="form.content"/>
            </v-container>
            
          </v-row>
        <v-card-actions>
          <v-card-text>
            <!-- 주석 공지사항 -->
            <v-chip-group
              active-class="blue-grey"
              column
            >
              <v-chip  @click="notice()">일반</v-chip>
              
              <v-chip @click="notice1()">공지사항</v-chip>
            </v-chip-group>
            <!-- 주석 공지사항 -->
          </v-card-text>
          <v-btn
            color="blue-grey"
            @click="saveClick()"
          >저장</v-btn>
          <v-btn
            color="blue-grey"
            @click="modalClose"
          >취소</v-btn>
        </v-card-actions>
        
        <v-snackbar
          v-model="alert"
          :timeout="timeout"
          top
          multi-line
          color="error"
          dark
          icon="mdi-alert-circle-outline"
          transition="scale-transition"
        >
        모두 입력해주세요
        </v-snackbar>

      </v-card>
    </v-dialog>
      <v-dialog v-model="commentDialog" width="500">
        <v-card>
              
            <v-card-title 
            style="color:white;background-color:#230871"
            >
              댓글 수정
             <v-spacer>
             </v-spacer>
        <v-icon 
        dark
        @click="modalClose3()">
        mdi-close
        </v-icon>
        </v-card-title>

            <v-card-text>
        <v-text-field
         label="댓글 수정"
        v-model="commentModify"
          append-outer-icon="mdi-pencil"
         @click:append-outer="modComment"
        />
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      source: String,
    },

  mounted () {
      this.comments.push({ content: 'abc', user:'aaa', _id:Math.random()})

      axios.get('http://192.168.0.115:3000/api/board', {
          users: 'getMan'
      })
      .then((r) => {
          this.posts = r.data.posts
      })
      .catch((e) => {
          console.error(e.message)
      })
    },

    data () {
      return {
        general:'',
        comments: [],
        commentAdd:"",
        
        commentDialog: false, //두번째 수정하기창
        commentModify:'',
        commentSell:null,
        snackbar: false,
        timeout: 999,
        dialog: false,
        dialog2: false,
        flag:'post',
        alert: false,
        alert2: false,
        page: 1,
        pageCount: 0,
        search: '',
        postCreateLink:[
          {
            to: {path: '/board/create'}
          }
        ],
        users:[],
        getMd: '',
        
        headers: [
          
          { width:'100px',
            sortable: false,
            text: '말머리',
            value: 'error',
            align: 'center'
          },
          

//주석 정렬
          {text: '제목',value: 'title',align:'center',sortable: false,width:'50%'},
          { text: '번호', value: 'id',sortable: false, align:"center"},
          { text: '작성자', value: 'writer',sortable: false, align:"center" },
          { text: '작성일', value: 'createdAt',sortable: false, align:"center" },
          { text: 'Actions', value: 'action', sortable: false, align:"center"},
 //주석 정렬 
  ],
        form: {
          id:1,
          title: '',
          writer:'',
          content: ''
       
        },

        posts: [
          {          
            
            error:'공지사항',            
            content:'sdfsdfsdfsdfsdf',
            title:'관리자',
            writer:'김민석',
            createdAt:222,
          },
          {
            error:'일반',
            content:'sdfsdfsdfsdfsdf',
            title:'fdfd',
            writer:'zzzzzz',
            createdAt:222
          },         
        ],
      }
    },
    methods: 
    {
//주석 말머리 글씨에 따라 색깔 변하는 부분
      getColor (error) {
      if (error == '일반') return 'grey'
        else return 'red'
        
      },
 gettext (error) {
        '공지'
        '일반'
      },
notice()
{

return this.general="일반"
},
notice1()
{

return this.general="공지사항"
},

//주석 말머리 
     modCommentDialog (cmt) {
       this.commentDialog = true
       this.commentModify = cmt.content //현재의 컨텐츠 내용
        this.commentSell = cmt
        
    },
    addComment()
    {
        const comment = {
        content:this.commentAdd,
        _id: Math.random(),
        user:'aaaa'
        }
        this.commentAdd = ''
        this.comments.push(comment)
     },

      modComment()
      {
        this.commentSell.content = this.commentModify
        this.commentDialog=false
      },
      boardDetail(item){
        this.form.id=item.id
        this.form.title = item.title
        this.form.writer = item.writer
        this.form.content = item.content
        this.dialog2=true
      },
      openEditModal(item){
        this.form.id=item.id
        this.form.title = item.title
        this.form.content = item.content
        this.flag='put'
        this.dialog=true
      },
      openAddModal(){
        this.flag='post'
        this.dialog=true
      },

      saveClick (item) {

        if (!this.form.title || !this.form.content)
          return this.alert=true

        if(this.flag === 'post'){
          axios.post('http://192.168.0.115:3000/api/board', {
              title:this.form.title,
              content:this.form.content,
          })
          .then((r) => {
            alert("게시글 생성이 완료되었습니다.")
            location.href="/api/board"
          })
          .catch((e) => {
            alert("에러가 발생하였습니다.")
            console.error(e.message)
          })
        }
        else if(this.flag === 'put'){
          
          axios.put('http://192.168.0.115:3000/api/board', 
            { 
              id: this.form.id,
              title: this.form.title,
              content: this.form.content } 
          )
          .then((r) => {
            alert("게시글 수정이 완료되었습니다.")
            location.href="/api/board"
          })
          .catch((e) => {
            alert("에러가 발생하였습니다.")
            console.error(e.message)
          })
        }
      },
      
      deletePost (item) {
        var delConfirm = confirm('정말 삭제하시겠습니까?')
        if(!delConfirm)
          return
          
        axios.delete('http://192.168.0.115:3000/api/board', 
        { data: 
          { id: item.id } 
        })
          .then((r) => {
            alert("삭제가 완료되었습니다.")
            location.href="/api/board"
          })
          .catch((e) => {
            alert("에러가 발생하였습니다.")
            console.error(e.message)
          })
      },

      modalClose(){
        this.form.title = ''
        this.form.content = ''
        this.dialog = false
      },
      modalClose2(){
        this.form.title = ''
        this.form.content = ''
        this.dialog2 = false
      },
       modalClose3(){
       this.commentModify = ''
        this.commentDialog = false
      }
    },
  components:{
    
  }
 }
</script>
<style scoped>

#board
{
  color : white
}

/* 제목 패딩 조절 */



</style>