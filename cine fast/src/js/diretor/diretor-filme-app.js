(function(){
	var diretorFilme = angular.module('diretorFilmeApp', ['diretor-filme-components']);		

	diretorFilme.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
        $scope.diretores = [];

        $scope.adicionarDiretor = function (diretor) {
            $scope.diretores.push(diretor);
        };

        $scope.uploadFile = function(){
            var file = $scope.myFile;
            console.log('file is ' );          
            
            var uploadUrl = "http://127.0.0.1:8000/cineFast/inserir_diretor";
            fileUpload.uploadFileToUrl(file, uploadUrl, $scope.diretor);

        };
    }]);	
})();