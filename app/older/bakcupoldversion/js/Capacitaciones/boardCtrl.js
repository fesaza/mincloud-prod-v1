sulhome.kanbanBoardApp.controller('boardCtrl', function ($scope, $uibModal, boardService) {
    // Model
    $scope.columns = [];
    $scope.isLoading = false;
    $scope.animationsEnabled = true;

    function init() {
        $scope.isLoading = true;
        $scope.refreshBoard();
    };

    $scope.refreshBoard = function refreshBoard() {
        $scope.isLoading = true;
        var searchs = window.location.search.split("=");
        var programaId = 0;
        if (searchs[1]) {
            programaId = searchs[1];
        }
        $scope.programaId = programaId
        boardService.getColumns(programaId)
           .then(function (data) {
               $scope.isLoading = false;
               $scope.columns = data;
           }, onError);
    };

    $scope.editNivel = function (nivel) {
        nivel.editingNivel = true;
    };

    $scope.endEditNivel = function (nivel) {
        boardService.editNivel(nivel).then(function () {
            nivel.editingNivel = false;
            $scope.isLoading = false;
            toastr.success("nivel editado");
            $scope.refreshBoard();
        }, onError);
    };

    $scope.addMateria = function ($event, nivel) {
        $event.preventDefault();
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalAddMateria.html',
            controller: 'materiaCtrl',
            resolve: {
                nivel: function () {
                    return nivel;
                },
                materia: function () {
                    var id = 1;
                    if (nivel.Tasks)
                        id = nivel.Tasks.length + 1
                    var materia = {
                        Id: id,
                        ColumnId: nivel.Id,
                        AreaId: 0,
                        MateriaId: 0,
                        Nivel: nivel
                    };
                    return materia;
                }
            }
        });

        modalInstance.result.then(function (materia) {
            $scope.isLoading = true;
            boardService.addMateria(materia).then(function () {
                $scope.isLoading = false;
                toastr.success("materia agregada");
                $scope.refreshBoard();
            }, onError);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.editMateria = function ($event, nivel, materia) {
        $event.preventDefault();
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalAddMateria.html',
            controller: 'materiaCtrl',
            resolve: {
                nivel: function () {
                    return nivel;
                },
                materia: function () {
                    return materia;
                }
            }
        });

        modalInstance.result.then(function (materia) {
            $scope.isLoading = true;
            //materia.Nivel = nivel;
            boardService.editMateria(materia).then(function () {
                $scope.isLoading = false;
                toastr.success("materia editada");
                $scope.refreshBoard();
            }, onError);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.removeMateria = function ($event, materia) {
        $event.preventDefault();
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalRemoveMateria.html',
            controller: 'removeMateriaCtrl',
            resolve: { nombreMateria: function () { return materia.Name;}}
        });

        modalInstance.result.then(function () {
            $scope.isLoading = true;
            boardService.removeMateria(materia.ColumnId,materia.Id).then(function () {
                $scope.isLoading = false;
                toastr.success("Materia eliminada");
                $scope.refreshBoard();
            }, onError);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.removeNivel=function($event, nivel){
           $event.preventDefault();
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalRemoveNivel.html',
            controller: 'removeNivelCtrl',
            resolve: { nombreNivel: function () { return nivel.Name;}}
        });

        modalInstance.result.then(function () {
            $scope.isLoading = true;
            boardService.removeNivel(nivel.Id).then(function () {
                $scope.isLoading = false;
                toastr.success("Nivel eliminado");
                $scope.refreshBoard();
            }, onError);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        }); 

    };

    $scope.addNivel = function ($event) {
        $event.preventDefault();

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalAddNivel.html',
            controller: 'nivelCtrl',
            resolve: {
                id: function () {
                    return $scope.columns.length + 1;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            debugger;
            var newNivel = selectedItem;
            $scope.isLoading = true;
            boardService.addNivel(newNivel.Id, newNivel.Nombre, $scope.programaId).then(function () {
                $scope.isLoading = false;
                toastr.success("Nivel agregado");
                $scope.refreshBoard();
            }, onError);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.onDrop = function (data, targetColId) {
        boardService.canMoveTask(data.ColumnId, targetColId)
            .then(function (canMove) {
                if (canMove) {
                    boardService.moveTask(data.Id, targetColId).then(function (taskMoved) {
                        $scope.isLoading = false;
                        $scope.refreshBoard();
                        //boardService.sendRequest();
                    }, onError);
                    $scope.isLoading = true;
                }

            }, onError);
    };

    // Listen to the 'refreshBoard' event and refresh the board as a result
    $scope.$parent.$on("refreshBoard", function (e) {
        $scope.refreshBoard();
        toastr.success("Programa actualizado correctamente");
    });

    var onError = function (errorMessage) {
        $scope.isLoading = false;
        toastr.error(errorMessage, "Error");
    };

    init();
});