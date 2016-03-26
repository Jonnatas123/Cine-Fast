// Empty JS for your own code to be here

function Acervo() {
	this.list = [];
}

Acervo.prototype = {
	adicionar: function(filme){
		this.list.push(filme);
	}
}

function AcervoLancamento(){
	Acervo.call(this);
}

AcervoLancamento.prototype = new Acervo();

function AcervoSinopse() {
	Acervo.call(this);
}

AcervoSinopse.prototype = new Acervo();

function AcervoCartaz() {
	Acervo.call(this);
}

AcervoCartaz.prototype = new Acervo();

function Filme() {

	this.titulo = '';
	this.descricao = '';
	this.data_lancamento = '';
	this.caminho_imagem = '';
	this.caminho_trailer = '';
	this.elenco = {};
	this.em_cartaz = true;
}

Filme.prototype = {
	addJSON: function(obj){
		if(obj != undefined){

			if(obj.hasOwnProperty('titulo')){
				this.titulo = obj['titulo'];		
			}
			if(obj.hasOwnProperty('descricao')){
				this.descricao = obj['descricao'];
			}
			if(obj.hasOwnProperty('data_lancamento')){
				this.data_lancamento = obj['data_lancamento'];
			}
			if(obj.hasOwnProperty('caminho_imagem')){
				this.caminho_imagem = obj['caminho_imagem'];
			}
			if(obj.hasOwnProperty('caminho_trailer')){
				this.caminho_trailer = obj['caminho_trailer'];
			}
			if(obj.hasOwnProperty('TipoDado')){
				this.elenco = obj['elenco'];
			}
			if(obj.hasOwnProperty('em_cartaz')){
				this.em_cartaz = obj['em_cartaz'];
			}
		}
	}
}

function buscaFilmesAjax() {
	 $.ajax(
		{
			dataType: 'json',
			contentType: 'application/json',
			url: "http://127.0.0.1:8000/cineFast/", 
			async: false,
    		cache: false,
    		success: function(data) {
    			descompactaJSON(data);
    		},
    		error: function(XMLHttpRequest, textStatus, errorThrown){
        		alert("Erro! " + errorThrown);
    		}
  	});
}

function enviarComentario(comentario, f) {
	filme = filmesSinopse.list[f];
	$.ajax(
		{
			type: "GET",
			url: "http://127.0.0.1:8000/cineFast/inserir_comentario", 
			data: {'filme': filme.titulo, 'comentario': comentario},
  	});
}

function retornarComentarios(pos){
	filme = filmesSinopse.list[pos];
	dados = '';	$.ajax({
		type: "GET",
		url: "http://127.0.0.1:8000/cineFast/listar_comentario",
		data: 'filme='+filme.titulo,
		success: function(data) {
			if(data != undefined){
				for(i = 0; i < data.length; i++){
					c = new Comentario();
					c.addJSON(data[i]);
					d = moment(new Date(c.data)).format('DD-MM-YYYY HH:MM:SS');
					$('.comentarios').append('<p><span>Data: '+d+'</span></p>');
					$('.comentarios').append('<p><span>'+c.texto+'</span></p>');
					$('.comentarios').append('<hr>');
				}
			}
		} 
			
  	});
}

var filmesLancamento = new AcervoLancamento();
var filmesSinopse = new AcervoSinopse();
var filmesEmCartaz = new AcervoCartaz();

function descompactaJSON(dados) {
	var tamanho = dados.length;
	for(i = 0; i < dados.length; i++) {
		obj = dados[i]
		if (obj.hasOwnProperty('TipoDado')){
			filme = new Filme();
			if(obj['TipoDado'] === 'filmesLancamento') {	
				filme.addJSON(obj);
				filmesLancamento.adicionar(filme)
				
			} else if(obj['TipoDado'] === 'filmesSinopse') {
				filme.addJSON(obj);
				filmesSinopse.adicionar(filme);
			}
			if(filme.em_cartaz){
				filmesEmCartaz.adicionar(filme);
			}
		}

	}
}

function preparaPagina() {
	if(filmesLancamento.list.length > 0) {
		for(i = 0; i < filmesLancamento.list.length; i++) {
			$('#titulo-'+(i+1)).html(filmesLancamento.list[i].titulo);
			$('#descricao-'+(i+1)).html(filmesLancamento.list[i].descricao);
			$('#img-'+(i+1)).attr('src', filmesLancamento.list[i].caminho_imagem);
		}
	}
	if(filmesSinopse.list.length > 0) {
		for(i = 0; i < filmesSinopse.list.length; i++) {
			$('#sin-titulo-'+(i+1)).html(filmesSinopse.list[i].titulo);

			descricao = filmesSinopse.list[i].descricao;
			if(filmesSinopse.list[i].descricao.length > 172){
				descricao = filmesSinopse.list[i].descricao.substring(0,167);
			} 
			descricao += '...';

			$('#sin-descricao-'+(i+1)).html(descricao);
			$('#sin-img-'+(i+1)).attr('src', filmesSinopse.list[i].caminho_imagem);
			$('#boxMais-'+(i+1)).attr('data-filme', i);
		}
	}
	if(filmesEmCartaz.list.length > 0) {
		var vermelho = true;
		for(i = 0; i < filmesEmCartaz.list.length; i++) {
			if(vermelho){
				$('#filmes_cartaz').append('<div class="list-group-item" style="background-color: #CD0000; color: white;">'+filmesEmCartaz.list[i].titulo+'</dvi>')
				vermelho = false;
			} else {
				$('#filmes_cartaz').append('<div class="list-group-item">'+filmesEmCartaz.list[i].titulo+'</div>')
				vermelho = true;
			}
		}
	}
}

function montaDetalhes(pos) {
	filme = filmesSinopse.list[pos];
	$('.cabeca').html('');
	$('.comentarios').html('');
	$('.elenco').html('');
	corpo = '<center><h4>'+filme.titulo+'</h4></center>';
	corpo += '<center><img id="sin-img-3" src="'+filme.caminho_imagem+'" />';
	corpo += '</center><br /><h4>Descrição</h4>';
	corpo += '<p>'+filme.descricao+'</p>';
	corpo += '</div>';

	corpoElenco = '';
	corpoElenco += '<h4>Elenco</h4>';
	for(i=0; i < filme.elenco.length; i++){
		elenco = filme.elenco[i];
		for(a=0; a < elenco.atores.length; a++){
			ator = elenco.atores[a];
			corpoElenco += '<div class="ator_elenco" style="postion:relative; float:left; width: 100px; height: 150px;">';
			corpoElenco += '<p><img src="'+ator.caminho_foto+'" width="80px" height="80"/></p>';
			corpoElenco += '<p><span>'+ator.nome+'</span><p/>';
			corpoElenco += '</div>'
		}
		corpoDiretor = '';
		corpoDiretor = '<h4>Diretor</h4>';
		for(d=0; d < elenco.diretores.length; d++) {
			diretor = elenco.diretores[d];
			corpoDiretor += '<div class="diretor_elenco" style="postion:relative; float:left; width: 100px; height: 150px;">';
			corpoDiretor += '<p><img src="'+diretor.caminho_foto+'" width="80px" height="80"/></p>';
			corpoDiretor += '<p><span>'+diretor.nome+'</span><p/>';
			corpoDiretor += '</div>'
		}
		corpoDiretor += '</div>';
	}
	
	$('.cabeca').append(corpo);
	$('.elenco').append(corpoElenco);
	$('.diretor').append(corpoDiretor);

	

}
$(document).ready(function(){
	buscaFilmesAjax();
	preparaPagina();
	
	$('#boxMais-3').on('click', function() {
		$('#coment').attr('data-filme', $(this).attr('data-filme'));
		comentarios = retornarComentarios($(this).attr('data-filme'));
		montaDetalhes($(this).attr('data-filme'));
	});

	$('#btn-coment').on('click', function(){
		comentario = $('#coment').val();
		if(comentario.length <= 0) {
			alert('erro');
		}else {
			enviarComentario(comentario, $('#coment').attr('data-filme'));
			$('.comentarios').append(comentario+'<br /><hr>');
		}
		return false;
	});
	$("#boxMais-3").animatedModal({
		modalTarget:'animatedModal',
        animatedIn:'bounceIn',
        animatedOut:'bounceOut',
        color:'#FFFFFF'
	});
		
});

function Comentario(){
	this.texto = '';
	this.data = '';
	this.autor = '';
}

Comentario.prototype = {
	addJSON: function(obj){
		if(obj != undefined) {
			if(obj.hasOwnProperty('texto')){
				this.texto = obj['texto'];
			}
			if(obj.hasOwnProperty('data')){
				this.data = obj['data'];
			}
			if(obj.hasOwnProperty['autor']){
				this.autor = obj['autor'];
			}
		}
	}
}