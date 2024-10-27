<template>
  <div>
    <!-- <router-link to="/login">login</router-link> -->


    <!-- <q-btn @click="com()">TEST</q-btn> -->

    <h1>Execute Sidecar</h1>
    <q-btn @click="pingSidecar">Run Sidecar</q-btn>
    <!-- <q-btn @click="runSecurityAudit">Run Audit</q-btn>
    <q-btn @click="runSecurity">Run Security Audit</q-btn>
    <q-btn @click="runSecurityDB">Database Access</q-btn> -->
    <p>Hello Click to see my name: {{ message }}</p>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from "vue";
  // import { invoke } from '@tauri-apps/api/tauri';
  // import { readTextFile } from '@tauri-apps/api/fs';
  import { Command } from '@tauri-apps/api/shell';

  async function startSidecar() {
    try {
      const command = Command.sidecar('binaries/my-sidecar'); // Adjust path if necessary
      await command.spawn();
      console.log('Sidecar started');
    } catch (error) {
      console.error('Error starting sidecar:', error);
    }
  }

  startSidecar();

  defineOptions({
    name: 'IndexPage'
  });

  const message = ref('')

  async function pingSidecar() {
    try {
      // Replace this with your sidecar call
      const res = await fetch("http://localhost:3000/people", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Error fetching people');
      }

      const peopleList = await res.json();
      console.log("Sidecar Response:", peopleList);
      message.value = peopleList?.[0]?.name
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // async function runSecurityAudit() {
  //   try {
  //     const report = await invoke('security_audit');
  //     console.log('Security Audit Report:', report);
  //   } catch (error) {
  //     console.error('Security audit failed:', error);
  //   }
  // }

  // async function runSecurity() {
  //   try {
  //     const report = await invoke('demonstrate_security');
  //     console.log('Security Report:', report);
  //   } catch (error) {
  //     console.error('Security failed:', error);
  //   }
  // }

  // async function runSecurityDB() {
  //   try {
  //     const report = await invoke('test_sqlite_security');
  //     console.log('test_sqlite_security:', report);
  //   } catch (error) {
  //     console.error('test_sqlite_security:', error);
  //   }
  // }

  // async function testFileRead() {
  //   try {
  //     const content = await readTextFile('/path/to/restricted/file.txt');
  //     console.log("File content:", content);
  //   } catch (error) {
  //     console.error("Access to read file is restricted as expected:", error);
  //   }
  // }

  // testFileRead();

  // async function pingSidecar() {

  //   try {
  //     const message = 'Tauri';
  //     const command = Command.sidecar('binaries/my-sidecar', ['ping', message]);
  //     const output = await command.execute();
  //     console.log('Sidecar response:', output.stderr);
  //   } catch (error) {
  //     console.error('Error executing sidecar:', error);
  //   }
  // }

  // const { invoke } = window.__TAURI__.tauri

  // invoke('greet', { name: 'World' })
  //   // `invoke` returns a Promise
  //   .then((response) => console.log(response))

  // FIXME ELECTRON COMMUNICATION THIS WAS A TEST 
  // const form = reactive({
  //   name: '',
  //   email: '',
  //   role: 'user'
  // });

  // console.log('form', form);

  // // Load users
  // const loadUsers = async () => {
  //   try {
  //     if (!isElectron) {
  //       console.log('Here we use axios...');
  //     } else {
  //       console.log('Here we use IPC...');
  //       const users = await window.electronAPI.getAllUsers();
  //       console.log('users', users);
  //     }
  //   } catch (error) {

  //   }
  // };

  // const handleSubmit = async () => {
  //   try {
  //     const userData = {
  //       name: 'test',
  //       email: 'test',
  //       role: 'test'
  //     }

  //     // Log the userData before sending it to Electron
  //     console.log('userData from the renderer:', userData);

  //     const result = await window.electronAPI.createUser(JSON.stringify(userData));
  //     // // await apiService.createUser(form.value);
  //     console.log('result', result);
  //   } catch (error) {
  //     console.error(error);

  //   }
  // };

  onMounted(() => {
    // console.log('isElectron', isElectron);
    // loadUsers()
  })

</script>
