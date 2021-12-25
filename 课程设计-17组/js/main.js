axios.defaults.baseURL = 'https://autumnfish.cn';
var srh_songs = [];
var Hot_comments = [];
var Comments_Like_counts = [];
var songs_list_selected = [];
function check_enter(){
    var theEvent = window.event;
    var code = theEvent.keyCode;
    if(code == 13){
        var query = myform.srh.value;
        window.location.href="search_music.html?"+'key='+encodeURI(query);
        window.event.preventDefault();//阻止浏览器默认操作，不然网页无法跳转。
    }
}
function searchMusic(){
    for(var i=0;i<30;i++){songs_list_selected[i]=0;}
    var loc = location.href;
    var n1 = loc.length;
    var n2 = loc.indexOf('=');
    var query = decodeURI(loc.substr(n2+1,n1-n2));
    query = query.replace("#","");
    if(query=="http://localhost:8080/课程设计-17组/search_music.html"){/*此页面默认打开的地址 */
        query="请输入要搜索的歌曲";                         
        var title = document.getElementById("srh_title"); /*默认打开时的设置，不搜索东西 */
        title.innerHTML=query;
        return;
    }
    var title = document.getElementById("srh_title");
    title.innerHTML="搜索\""+query+"\"，找到30首单曲";
    if(query == 0){
        return
    }
    axios.get('/search?keywords='+query).then( response =>{
        srh_songs = response.data.result.songs;  
        console.log(response);
    //    console.log(srh_songs[3]);
        for(var i =0 ; i<srh_songs.length;i++){
            var arr_artist = srh_songs[i].artists;
            var theartsits=arr_artist[0].name;
            for(let j=1;j<arr_artist.length;j++){
                theartsits += "/"+arr_artist[j].name;
            }
            document.getElementsByClassName("songs_title")[i].innerHTML = (i+1)+". "+srh_songs[i].name;
            document.getElementsByClassName("songs_author")[i].innerHTML = theartsits;
            document.getElementsByClassName("songs_list_item_time")[i].innerHTML = ms_change(srh_songs[i].duration);
        }
    }
    )
    query='';
}
function playMusic(songs_id){
    for(let x=0;x<30;x++){
        if(x!=songs_id){songs_list_selected[x]=0;}else{songs_list_selected[x]=1};
        document.getElementsByClassName("songs_title")[x].style.color ="white";
        document.getElementsByClassName("songs_author")[x].style.color ="#c0c0c0";
    }
    document.getElementsByClassName("songs_title")[songs_id].style.color ="#25a56a";
    document.getElementsByClassName("songs_author")[songs_id].style.color ="#25a56a";
    if(srh_songs == null){
        return;
    }
    document.getElementById("player_song_title").innerHTML = srh_songs[songs_id].name;
    let ar_artist = srh_songs[songs_id].artists;
    let the_artsits=ar_artist[0].name;
    for(let j=1;j<ar_artist.length;j++){
        the_artsits += "/"+ar_artist[j].name;
    }
    document.getElementById("player_song_author").innerHTML = the_artsits;
    var musicId = srh_songs[songs_id].id;
    axios.get('/song/url?id=' + musicId).then( response =>{
         //console.log(response.data.data[0]);
         document.getElementById("audio").src =response.data.data[0].url;
        // document.getElementById("Myplayer").play();
        document.getElementById("audio").play();
        document.getElementById("inPlay").style.display = "block";
        document.getElementById("inPause").style.display = "none";
     })
    // 获取歌曲封面
    axios.get('/song/detail?ids=' + musicId).then(response => {
        //console.log(response);
        // 设置封面
        document.getElementById("songs_cover").src = response.data.songs[0].al.picUrl
    })
     // 获取歌曲热门评论
     axios.get('/comment/hot?type=0&id=' + musicId).then(response => {
        Hot_comments = response.data.hotComments;
        console.log(Hot_comments);
       // 保存热门评论
       //this.hotComments = response.data.hotComments;
       for(var k=0;k<20;k++){
           var avatar = document.getElementsByClassName("comments_avatar")[k];
           var cm_name = document.getElementsByClassName("comments_name")[k];
           var cm_time = document.getElementsByClassName("comments_time")[k];
           var cm_text = document.getElementsByClassName("comments_text")[k];
           var cm_like = document.getElementsByClassName("LikeCount")[k];
           avatar.src = Hot_comments[k].user.avatarUrl;
           cm_name.innerHTML =  Hot_comments[k].user.nickname;
           cm_time.innerHTML = Hot_comments[k].timeStr;
           cm_text.innerHTML = Hot_comments[k].content;
           Comments_Like_counts.push(Hot_comments[k].likedCount);
           cm_like.innerHTML = Comments_Like_counts[k];
       }
       document.getElementsByClassName("Comment")[0].style.display = "block";
   })
}
function ms_change(ms){
    var m = Math.floor(ms/60000);
    var s = Math.round((ms-60000*m)/1000);
    if(s<10){
        s = "0"+s;
    }
    var str ="";
    if(m<10){
        str =" " + m +" 分 "+s+"秒";}
    else{
        str =  m +" 分 "+s+"秒";
    }
    return str;
}
function PlayOut(s_id){
    var myAudio = document.getElementById("audio");
    if(songs_list_selected[s_id]==0){
        playMusic(s_id);
        return;
    }
    if(myAudio.paused){
        myAudio.play();
        document.getElementById("inPlay").style.display = "block";
        document.getElementById("inPause").style.display = "none";
    }else{
        myAudio.pause();
        document.getElementById("inPlay").style.display = "none";
        document.getElementById("inPause").style.display = "block";
    }
}
function addLike(i){
    var cm_like = document.getElementsByClassName("LikeCount")[i];
    var count1 = (Comments_Like_counts[i])+1;
    Comments_Like_counts[i] = count1;
    cm_like.innerHTML = count1;
}
