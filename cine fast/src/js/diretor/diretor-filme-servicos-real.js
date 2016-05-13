(function(){

	var diretorService = angular.module('diretor-filme.servicos', []);

	diretorService.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl, diretor, $scope){
               
               var fd = new FormData();
               fd.append('id', diretor.id);
               fd.append('nome', diretor.nome);
               fd.append('image', file);
            
               $.ajax({
                  url: uploadUrl,
                  data: fd,
                  processData: false,
                  contentType: false,
                  type: 'POST',
                  success: function(data) {
                      dado = data;
                      window.setTimeout('location.reload()', 100);
                  } 
         
               });


            }
    }]);
    diretorService.factory('DiretorAPI', function ($http) {
      const delay = 1;
      const BASE = 'http://127.0.0.1:8000/cineFast/';
    
      function extrairDados(f) {
        return function (ajaxRetorno) {
          return f(ajaxRetorno.data);
        }
      }
      return {
        deletar: function (id, callbackSucesso, callbackErro, callbackAlways) {
          callbackSucesso = extrairDados(callbackSucesso);
          //callbackErro=extrairDados(callbackErro);
          var fd = new FormData();
          fd.append('id', id);

          $.ajax({
            url: BASE + 'remover_diretor',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data) {
              dado = data;
              window.setTimeout('location.reload()', 100);
            } 
         
          });
        },
        editar: function (diretor, callbackSucesso, callbackErro, callbackAlways) {
          callbackSucesso = extrairDados(callbackSucesso);
          var fd = new FormData();
          fd.append('id', diretor.id);
          fd.append('nome', diretor.nome);
          $.ajax({
              url: BASE + 'inserir_diretor',
              data: fd,
              processData: false,
              contentType: false,
              type: 'POST',
              success: function(data) {
                dado = data;
                window.setTimeout('location.reload()', 100);
              }
          });
        },
        listar: function (callbackSucesso, callbackErro, callbackAlways) {
          callbackSucesso = extrairDados(callbackSucesso);
          $http.get(BASE+"listar_diretor").then(
            callbackSucesso, callbackErro
          ).finally(callbackAlways);
        },
        abrirFoto: function() {
          alert('adfd');
        }
      };
  });
})();