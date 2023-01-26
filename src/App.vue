<template>
  <div id="app">
    <div class="container">


      <div v-for="erro in this.errors" :key="erro.id">
        {{ erro }}
      </div>

      <form style="margin-bottom: 30px;" @submit.prevent="salvar">
        <label>Nome</label>
        <input type="text" placeholder="Nome" v-model="produto.nome">
        <label>Preço</label>
        <input type="number" placeholder="Preço" v-model="produto.preco">
        <label>Descrição</label>
        <input type="text" placeholder="Descrição" v-model="produto.descricao">
        <input type="file" @change="onFileChange"><br><br>

        <button class="waves-effect waves-light btn-small">Salvar<i class="material-icons left">save</i></button>
      </form>
      <form v-if="this.produtos.length > 0" @submit.prevent="dialog">
        <label style="margin-right: 10px;">Entrar em moto de edição -></label><button
          class="waves-effect btn-small blue darken-1 botao"><i class="material-icons">create</i></button>
      </form>
      <div v-for="produto in produtos" :key="produto.id">
        <div
          style="display: flex; align-items: center; margin: 10px 0; justify-content: space-between; box-shadow: 0px 0px 5px #AAA; padding: 10px;    border-radius: 10px;">
          <div style="display: flex; align-items: center;">
            <img :src="`${produto.imagem}`" width="50">
            <label style="margin: 0 20px;">{{ produto.nome }}</label>
          </div>
          <div>
            <form @submit.prevent="deletar(produto)">
              <button class="waves-effect btn-small red darken-1 botao"><i
                  class="material-icons">delete_sweep</i></button>
            </form>
          </div>
        </div>
        <v-card v-if="this.showDialog">
          <v-card-title>
            <span class="text-h5"></span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <input type="text" placeholder="Nome" v-model="produto.nome" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <input type="text" placeholder="Preco" v-model="produto.preco" />
                </v-col>
                <v-col cols="12">
                  <input type="text" placeholder="Descricao" v-model="produto.descricao" />
                </v-col>
                <v-col cols="12">
                  <input type="file" @change="onFileChange">
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="this.showDialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="editar(produto)">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>

import Produto from './service/produtos';

export default {
  data() {
    return {
      produtos: [],
      imagem: './assets/logo.png',
      produto: {
        id: '',
        nome: '',
        preco: '',
        descricao: '',
        imagem: ''
      },
      errors: [],
      showDialog: false
    }
  },
  mounted() {
    this.listar()
  },
  methods: {
    listar() {
      Produto.listar().then(
        res => {
          this.produtos = res.data.data
        }
      )
    },
    salvar() {
      if (this.produto.id) {
        Produto.editar(this.produto).then((res) => {
          this.produto = {}
          this.errors = {}
          this.showDialog = false;
          alert(res.data.data.message)
          this.listar()
        }).catch(e => {
          this.errors = e.response.data.data.message;
        })
      } else {
        Produto.salvar(this.produto).then((res) => {
          this.produto = {}
          alert(res.data.data.message)
          this.listar()
          this.errors = {}
        }).catch(e => {
          this.errors = e.response.data.data.message;
        })
      }

    },
    fileToBase64(FileObject) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.produto.imagem = event.target.result;
      }
      reader.readAsDataURL(FileObject);
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.fileToBase64(files[0]);
    },
    dialog() {
      if (this.showDialog) {
        this.showDialog = false;
      } else {
        this.showDialog = true;
      }

    },
    editar(produto) {
      if(this.produto.imagem != "")
      {
        produto.imagem = this.produto.imagem
      }
      this.produto = produto
      this.salvar()
    },
    deletar(produto)
    {
       Produto.remover(produto.id).then((res) => {
          alert(res.data.data.message)
          this.listar()
       })
    }
  }
}
</script>

<style>
.container {
  margin-top: 30px;
}

.botao {
  margin-right: 20px;
}
</style>