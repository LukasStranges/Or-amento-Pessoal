class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] === undefined || this[i] === '' || this[i] === null){
                return false
            }
        }
        return true
    }
}

class BD{
    constructor(){
        let id = localStorage.getItem('id');
        if(id === null){
            localStorage.setItem('id',0);
        }
    }
    getProximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id,JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuprarTodosRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id')

        //Recuperar todas as despesas cadastradas no localStorage
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)   
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasfiltradas = Array()
        despesasfiltradas = this.recuprarTodosRegistros()

         //ano
         if(despesa.ano != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.ano == despesa.ano)
         }
        
         //mes
         if(despesa.mes != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.mes == despesa.mes)
         }
         //dia
         if(despesa.dia != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.dia == despesa.dia)
         }
         //tipo
         if(despesa.tipo != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.tipo == despesa.tipo)
         }
         //descricao
         if(despesa.descricao != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.descricao == despesa.descricao)
         }
        return despesasfiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function registrar(){
    const ano = document.getElementById('ano')
    const mes = document.getElementById('mes')
    const dia = document.getElementById('dia')
    const tipo = document.getElementById('tipo')
    const descricao = document.getElementById('descricao')
    const valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)
        alert('Despesa Cadastrada com sucesso');
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value =''
        valor.value = ''
    }else{
        alert("[ERRO] Campos vazios");
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuprarTodosRegistros();
    }
    
   let listaDespesas = document.getElementById('listaDespesas');
   listaDespesas.innerHTML = ''
   despesas.forEach(function(d){
       let linha = listaDespesas.insertRow();
       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
       switch(d.tipo){
        case '1':
            d.tipo = 'Alimentação'
            break
        case '2':
            d.tipo = 'Educação'
            break
        case '3':
            d.tipo = 'Lazer'
            break
        case '4':
            d.tipo = 'Saúde'
            break
        case '5':
            d.tipo = 'Transporte'
            break
       }
       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor

       //botao exclusão
       let btn = document.createElement('button')
       btn.className = 'btn btn-danger'
       btn.innerHTML = '<i class="fas fa-times"></i>'
       btn.id = `id_despesa_${d.id}`
       btn.onclick = function(){
        //remover a despesa
        let id = this.id.replace('id_despesa_', '')
        bd.remover(id)
        alert('Despesa Removida Com Seucesso')
        window.location.reload()
       }
       linha.insertCell(4).append(btn)
   })
}
function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
    let despesas = bd.pesquisar(despesa)
    
    carregaListaDespesas(despesas, true)
}