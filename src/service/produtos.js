import { http } from './config'

export default { 
    listar:() => {
        return http.get('produtos')
    },
    salvar:(produto) => {
        return http.post('produtos', produto)
    },
    editar:(produto) => {
        return http.put('produtos/' + produto.id, produto)
    },
    remover:(id) => {
        return http.delete('produtos/' + id)
    }
}