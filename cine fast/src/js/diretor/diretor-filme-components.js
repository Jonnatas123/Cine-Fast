(function(){

	var diretorComponents = angular.module('diretor-filme-components', ['diretor-filme.servicos']);
	var diretorFoto = '';
    diretorComponents.directive('diretorForm', function () {
	    return {
	      restric: 'E',
	      templateUrl: 'diretor-filme-form.html',
	      replace: true,
	      scope: {
	        salvarDiretorFilmeListener: '&'
	      },
	      controller: function($scope, DiretorAPI) {
	      	$scope.salvar = function (diretor) {
	      		$scope.salvandoDiretorFlag = true;
	      		DiretorAPI.salvar(diretor, function (diretorSalva) {
	      			$scope.salvarDiretorFilmeListener({'diretor': diretorSalva});
	      		},
	      		function (erros) {
              		$scope.erros = erros;
              		console.log(erros);
            	}, function () {
              		$scope.salvandoCategoriaFlag = false;
            	});
	      	}
	      }
  		}
  	});
  	diretorComponents.directive('diretorTabela', function () {
	    return {
	      restric: 'E',
	      templateUrl: 'diretor-filme-tabela.html',
	      replace: true,
	      scope: {
	        diretores: '='
	      },
	      controller: function ($scope, DiretorAPI) {
	        $scope.listandoDiretoresFlag = true;
	        DiretorAPI.listar(function (diretores) {
            console.log(diretores);
            if(diretores != '1') {
              $.each(diretores, function (index, cat) {
                $scope.diretores.push(cat);
              });
            }
	          
	        }, function () {

	        }, function () {
	          $scope.listandoDiretoresFlag = false;
	        });

	        /*$scope.removerLinha = function (index) {
	          $scope.diretores.splice(index, 1);
	        }*/
	      }
	    };
  	});

    diretorComponents.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                  
                element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                    var reader = new FileReader();
		       			reader.onload = imageIsLoaded;
		        		reader.readAsDataURL(element[0].files[0]);
	                });
            	});
            }
        };
    }]);

    diretorComponents.directive('diretorTabelaLinha', function () {
    	return {
      		restric: 'A',
      		templateUrl: 'diretor-filme-tabela-linha.html',
      		replace: true,
     		scope: {
        		diretor: '=',
       		 	deletarDiretorListener: '&'
      		},
      		controller: function ($scope, DiretorAPI) {
        		$scope.editandoFlag = false;
        		$scope.diretorParaEdicao = {};

        		$scope.editarToggle = function () {
          			$scope.editandoFlag = !$scope.editandoFlag;
          			$scope.diretorParaEdicao.nome = $scope.diretor.nome;
                $scope.diretorParaEdicao.id = $scope.diretor.id;
       			};

        		$scope.editar = function () {
          			DiretorAPI.editar($scope.diretorParaEdicao, function (diretor) {
           			$scope.diretor.nome = diretor.nome;
            		$scope.editandoFlag = false;
          		});
        	};

        	$scope.deletar = function () {
          		DiretorAPI.deletar($scope.diretor.id, function () {
            		$scope.deletarDiretorListener();
          		});
        	};
          $scope.abrirFoto = function () {
              $('#myImg').attr('src', $scope.diretor.caminho_foto);
              setTimeout(function() {
                  $('#myImg').attr('src', '../../img/user_icon.png');
              }, 10000);
          };

      	}

    };
  });

    function imageIsLoaded(e) {
        $('#myImg').attr('src', e.target.result);
    }
})();