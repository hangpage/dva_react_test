import dva, { connect } from 'dva';
import {Router, Route, Switch} from 'dva/router';
import React from 'react';
import styles from './index.less';

// 1. Initialize
const app = dva();

// 2. Model
app.model({
  namespace: 'count', //namespace 是 model state 在全局 state 所用的 key
  state: {
    current: 0,
    record: 0
  },
  reducers: {
    add(state){
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.current ? newCurrent : state.record,
        current: newCurrent
      }
    },
    minus(state){
      return {...state,
        current: state.current - 1
      }
    }
  },
  /*
  *  put 用于触发 action
  *  call 用于调用异步逻辑，支持 promise
  *  select 用于从 state 里获取数据
  *
  * */
  effects: {
    *add({payload}, { put, call }){
        console.log({payload})
        yield call(delay, 1000);
        yield put({type: 'minus'});
    }
  },
});

function mapStateToProps(state) {
  return { count: state.count };
}

/*
  dispatch({
      type: 'user/add', // 如果在 model 外调用，需要添加 namespace
      payload: {}, // 需要传递的信息
  });
 */

const CountApp = ({count, dispatch}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={() => { dispatch({type: 'count/add', payload: 'xxxx'}); }}>+</button>
      </div>
    </div>
  );
};


// 3. Router
const HomePage = connect(mapStateToProps)(CountApp);
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);


function delay(timeout){
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}


// 4. Start
app.start('#root');
