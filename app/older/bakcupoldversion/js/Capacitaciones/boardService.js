sulhome.kanbanBoardApp.service('boardService', function ($http, $q, $rootScope) {
    var proxy = null;
    

    var getColumns = function (programaId) {
        return $http.get(directory + "api/BoardWebApi", { params: { programaId: programaId } }).then(function (response) {
            return response.data;
        }, function (error) {
            return $q.reject(error.data.Message);
        });
    };

    var canMoveTask = function (sourceColIdVal, targetColIdVal) {
        return $http.get(directory + "api/BoardWebApi/CanMove", { params: { sourceColId: sourceColIdVal, targetColId: targetColIdVal } })
            .then(function (response) {
                return response.data.canMove;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var moveTask = function (taskIdVal, targetColIdVal) {
        return $http.post("/api/BoardWebApi/MoveTask", { taskId: taskIdVal, targetColId: targetColIdVal })
            .then(function (response) {
                return response.status == 200;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var addNivel = function (orden, nombre, programaId) {
        return $http.post(directory + "api/NivelApi/AddNivel", { orden: orden, nombre: nombre, programaId: programaId })
            .then(function (response) {
                return response.status == 200;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var editNivel = function (nivel) {
        return $http({ method: "PUT", url: "/api/NivelApi/EditNivel", data: nivel })
                .then(function (response) {
                    return response.status == 200;
                }, function (error) {
                    return $q.reject(error.data.Message);
                });
    };

    var addMateria = function (materia) {
        return $http({ method: "POST", url: directory + "api/MateriaApi/AddMateria", data: materia })
            .then(function (response) {
                return response.status == 200;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var editMateria = function (materia) {
        return $http({ method: "PUT", url: directory + "api/MateriaApi/EditMateria", data: materia })
                .then(function (response) {
                    return response.status == 200;
                }, function (error) {
                    return $q.reject(error.data.Message);
                });
    };

    var removeMateria = function (materiaId, nivelId) {
        return $http({
            method: "DELETE", url: directory + "api/MateriaApi/RemoveMateria", headers: {
                'Content-type': 'application/json'
            }, data: { materiaId: materiaId, columnId: nivelId }
        })
                .then(function (response) {
                    return response.status == 200;
                }, function (error) {
                    return $q.reject(error.data.Message);
                });
    };

    var removeNivel = function (nivelId) {
        return $http({
            method: "DELETE", url: directory + "api/NivelApi/RemoveNivel", headers: {
                'Content-type': 'application/json'
            }, data: { columnId: nivelId }
        })
                .then(function (response) {
                    return response.status == 200;
                }, function (error) {
                    return $q.reject(error.data.Message);
                });
    };

    var initialize = function () {

    };

    // Call 'NotifyBoardUpdated' on SignalR server
    var sendRequest = function () {
        //this.proxy.invoke('NotifyBoardUpdated');
    };

    return {
        initialize: initialize,
        sendRequest: sendRequest,
        getColumns: getColumns,
        canMoveTask: canMoveTask,
        moveTask: moveTask,
        addNivel: addNivel,
        editNivel:editNivel,
        addMateria: addMateria,
        editMateria: editMateria,
        removeMateria: removeMateria,
        removeNivel:removeNivel
    };
});