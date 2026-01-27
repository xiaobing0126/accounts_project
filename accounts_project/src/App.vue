<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

enum aaa {
  a,
  b,
  c,
}

function test(c: aaa): string {
  switch (c) {
    case aaa.a:
      return 'A'
      break
    case aaa.b:
      return 'B'
      break
    case aaa.c:
      return 'C'
      break
    default:
      return haha(c)
  }
}

function haha(x: never): never {
  throw new Error('not defined')
}

// test(aaa.a)

// any语法
// const calArr = (data: any): any[] => {
//   const list = []
//   for (let i = 0; i < 3; i++) {
//     list.push(data)
//   }
//   return list
// }
// console.log(calArr('d'))

// 原本写法
const calArr1 = (data) => {
  const list = []
  for (let i = 0; i < 3; i++) {
    list.push(data)
  }
}
// 以上写法报错，用泛型T去写
// 1.首先传入T泛型参数: (data: T)
// 2.返回T泛型结果 (data: T): T[]
// 3.接收的list也需要用泛型T定义: const list: T[] = []
// 4.此时data: T会提示T没被定义，需要在data前面加传入的泛型T参数<T,>(data: T):T[]
// 5.变成如下样式

// // 泛型语法
// const calArr1 = <T,>(data: T): T[] => {
//   const list: T[] = []
//   for (let i = 0; i < 3; i++) {
//     list.push(data)
//   }
//   return list
// }
// console.log(calArr1({ name: '小宗', age: 30 }))

// // 多类型传参,T,U这种字母自己随便定义的
// const calArr2 = <T, U>(name: T, age: U): { name: T; age: U } => {
//   const res: { name: T; age: U } = { name, age }
//   return res
// }
// console.log(calArr2('小宗', 30))

/**
 * typeof
const info = {
  name: '小宗',
  age: 7,
  sex: 'male',
}
type Props = typeof info

const getinfo = (data: Props) => {
  return data.name
}
console.log(getinfo(info))
*/

/**
 * keyof
interface Props {
  name: string
  age: number
  sex: boolean
}
type PropsKey = keyof Props
const res: PropsKey = 'name'
console.log(res)
 */

// const userAges1: Record<string, number> = {
//   张三: 20,
//   李四: 32,
// }
// console.log(userAges1)
// const userAges2: { [key: string]: number } = {
//   张三: 20,
//   李四: 32,
// }
// console.log(userAges2)

type ss = {}
interface user {
  name: string
  sex
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
