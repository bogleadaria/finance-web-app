<script setup lang="ts">
import { collection, addDoc } from 'firebase/firestore'

const { $db } = useNuxtApp()

async function test() {
  const ref = await addDoc(collection($db, 'test'), { hello: 'world', at: Date.now() })
  console.log('written:', ref.id)
}
</script>

<template>
  <button @click="test">Write test doc</button>
</template>