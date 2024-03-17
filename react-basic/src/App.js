import {  useState, useRef, useEffect} from 'react'
import './App.scss'
import _ from 'lodash'
import avatar from './images/bozai.jpg'
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'
import axios from 'axios'

// const list = [
//   {
//     "rpid": 3,
//     "user": {
//       "uid": "13258165",
//       "avatar": "https://n.sinaimg.cn/front20200823ac/560/w1080h1080/20200823/f68e-iyaiihm2584530.jpg",
//       "uname": "周杰伦"
//     },
//     "content": "哎哟，不错哦",
//     "ctime": "10-18 08: 15",
//     "like": 126
//   },
//   {
//     "rpid": 2,
//     "user": {
//       "uid": "36080105",
//       "avatar": "http://pic.baike.soso.com/p/20140619/20140619144054-1617901515.jpg",
//       "uname": "许嵩"
//     },
//     "content": "我寻你千百度 日出到迟暮",
//     "ctime": "11-13 11: 29",
//     "like": 88
//   },
//   {
//     "rpid": 1,
//     "user": {
//       "uid": "30009257",
//       "avatar":avatar,
//       "uname": "黑马前端"
//     },
//     "content": "学前端就来黑马",
//     "ctime": "10-19 09: 00",
//     "like": 66
//   },
// ]

const user = {
  // 用户ids
  uid: '30009257',
  // 用户头像
  avatar,
  // 用户昵称
  uname: '黑马前端',
}

const tabs = [
  { type: 'hot', text: '最热' },
  { type: 'time', text: '最新' },
]

//封装请求数据的Hook
function useGetList(){
  //获取接口数据渲染
  const [commentList, setCommentList] = useState([])

  //获取接口请求
  useEffect(()=>{
    //请求数据
    async function getList () {
      //axios 请求数据
      const res = await axios.get('http://localhost:3004/list')
      setCommentList(res.data)
    }
    getList()
  },[])
  //return出去的内容为数据以及修改它的方法
  return {commentList, setCommentList}
}

//封装Item组件
function Item ({item, onDel}){
  return(
    <div className="reply-item">
                    {/* 头像 */}
                    <div className="root-reply-avatar">
                      <div className="bili-avatar">
                        <img
                          className="bili-avatar-img"
                          alt=""
                          src={item.user.avatar}
                        />
                      </div>
                    </div>
                    <div className="content-wrap">
                      {/* 用户名 */}
                      <div className="user-info">
                        <div className="user-name">{item.user.uname}</div>
                      </div>
                      {/* 评论内容 */}
                      <div className="root-reply">
                        <span className="reply-content">{item.content}</span>
                        <div className="reply-info">
                          {/* 评论时间 */}
                          <span className="reply-time">{item.ctime}</span>
                          {/* 评论数量 */}
                          <span className="reply-time">点赞数:{item.like}</span>
                          {user.uid === item.user.uid &&
                          //子组件中触发父组件中的方法
                          <span className="delete-btn" onClick={()=>onDel(item.rpid)} >
                          删除
                          </span>}
                          
                        </div>
                      </div>
                    </div>
                </div>
  )

}

function App() {
  //使用useState维护list
  // const [commentList, setCommentList] = useState(_.orderBy(list, 'like', 'desc'))

  //解构出来原本需要用到的地方
  const {commentList, setCommentList} = useGetList()  

  const handleDel = (id)=>{
    console.log(id)
    //对commentList做过滤处理
    //filter是返回一个新数组，不更改老数组
    setCommentList(commentList.filter(item => item.rpid !== id))
  }

  const[type, setType] = useState('hot')

  const handleTabChange = (type) => {
    console.log(type)
    setType(type)
    if(type === 'hot') {
      setCommentList(_.orderBy(commentList, 'like', 'desc'))
    }else{
      setCommentList(_.orderBy(commentList, 'ctime', 'desc'))
    }
  }

  const [content, setContent] = useState('')

  const inputRef = useRef(null)

  const handPublish = () =>{
    setCommentList([
      ...commentList,
      {
        "rpid": uuidV4(),
        "user": {
          "uid": "30009257",
          "avatar": avatar, 
          "uname": "黑马前端"
        },
        "content": content,
        "ctime":dayjs(new Date()).format('MM-DD hh:mm'),
        "like": 66
      }
    ])
    setContent('')
    inputRef.current.focus()
  }

  return (
    <div className='app'>
      <div className='reply-navigation'>
        <ul className='nav-bar'>
          <li className='nav-title'>
            <span className='nav-title-text'>评论</span>
            <span className='nav-title-text'>{10}</span>
          </li>
          <li className='nav-sort'>
            {tabs.map(item=> 
              <span 
                key={item.type} 
                onClick={()=>handleTabChange(item.type)} 
                className={`nav-item ${type === item.type && 'active'}`}>
                  {item.text}
                </span>)}
          </li>
        </ul>
      </div>
      <div className='reply-wrap'>
        <div className='box-normal'>
          <div className='reply-box-avatar'> 
            <div className='bili-avatar'>
              <img className='bili-avatar-img' src={avatar} alt="用户头像"/>
            </div>
          </div>
          <div className='reply-box-wrap'>
            <textarea
              className='reply-box-textarea'
              placeholder='发一条友善的评论'
              value={content}
              ref={inputRef}
              onChange={(e)=>setContent(e.target.value)}
              />
            <div className='reply-box-send'>
              <div className="send-text" onClick={handPublish} >发布</div>
            </div>
          </div>
        </div>
        <div className='reply-list'>
          {/* 评论项 */}
          {/* 该给组件传啥就传啥，数据项，删除逻辑等 */}
          {commentList.map(item =><Item key={item.id} item={item} onDel={handleDel}/>)}
        </div>
      </div>
    </div>
  );
}

export default App;
