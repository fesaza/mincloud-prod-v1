sulhome.kanbanBoardApp.controller('nivelCtrl', function ($scope, $uibModalInstance, id) {
    $scope.nivel = {
        Id: id
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.nivel);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

sulhome.kanbanBoardApp.controller('materiaCtrl', function ($scope, $uibModalInstance, nivel, materia) {
    if (materia) {
        $scope.materia = materia
    }
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.materia);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


sulhome.kanbanBoardApp.controller('removeMateriaCtrl', function ($scope, $uibModalInstance,nombreMateria) {
$scope.materia = nombreMateria;
    $scope.ok = function () {
        $uibModalInstance.close($scope.materia);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


sulhome.kanbanBoardApp.controller('removeNivelCtrl', function ($scope, $uibModalInstance,nombreNivel) {
$scope.nivel = nombreNivel;
    $scope.ok = function () {
        $uibModalInstance.close($scope.nivel);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});