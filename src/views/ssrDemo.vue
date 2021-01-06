<template>
  <div>
      {{user}}
      {{name}}
      {{age}}
      <router-link to="/ssrDetail">跳转详情</router-link>
  </div>
</template>

<script>
export default {
    name:"SSRDEMO",
    asyncData({ store, route: { params: { id }}}){
        return new Promise((resolve,reject)=>{
             setTimeout(() => {
                 resolve({"name":"fanjaintao"});
             },3000);
        })
        //  store.dispatch("GET_USER")
    },
    data(){
        return {
             name:'',
             age:'',
        }
    },
    beforeCreate(){
      
    },
    computed:{
        user(){
            return this.$store.state.user
        }
    },
    mounted(){
        console.log(this.$store.state.user)
        // console.log(this.$store.dispatch("GET_USER"))
    }

}
</script>

<style>

</style>