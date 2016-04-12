angular.module('starter')

.controller('HomeCtrl', function($scope, $state, factoryLogin, factoryRegister,
  $stateParams, serviceLogin, $timeout, ionicMaterialMotion, ionicMaterialInk,
  $rootScope, $ionicPopup) {
  $scope.$parent.clearFabs();
  $timeout(function() {
    $scope.$parent.hideHeader();
  }, 0);
  ionicMaterialInk.displayEffect();

  $scope.login = function() {
    var ref = new Firebase("https://firefacetest.firebaseio.com");

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
        $ionicPopup.alert({
          title: 'Erro!',
          template: 'Login Falhou'
        });
      } else {
        $rootScope.fblogged = true;
        $rootScope.logged = true;
        console.log(authData);

        serviceLogin.setUser(
          authData.facebook.displayName,
          authData.facebook.email,
          null,
          authData.facebook.id
        );
        factoryRegister.save(serviceLogin.getUser());
        $state.go('app.profile');
        $rootScope.user = serviceLogin.getUser();
        console.log($rootScope.user);
      }
    });
  }

  $scope.create = function(user) {

    factoryRegister.save(user, function(user) {
      $ionicPopup.alert({
        title: 'Sucesso!',
        template: 'Logado com sucesso!'
      });
      console.log(user);
    }, function(error) {
      $ionicPopup.alert({
        title: 'Erro!',
        template: 'Cadastro falhou, verifique os dados ou se o email ja foi cadastrado'
      });
    });
  }

  $scope.logout = function(user) {
    serviceLogin.setUser(
      null,
      null,
      null,
      null
    );
    factoryRegister.save(serviceLogin.getUser());
    $rootScope.user = serviceLogin.getUser();
    console.log($rootScope.user);
    $state.go('app.home');
    $rootScope.fblogged = false;
    $rootScope.logged = false;
  }

  $scope.loginEmail = function(user) {
    factoryLogin.get(user, function(user) {
      serviceLogin.setUser(
        user.name,
        user.email,
        user.score,
        user.token
      );
      factoryRegister.save(serviceLogin.getUser());
      $rootScope.user = serviceLogin.getUser();
      console.log($rootScope.user);
      $state.go('app.profile');
      $rootScope.fblogged = false;
      $rootScope.logged = true;
    }, function(error) {
      $ionicPopup.alert({
        title: 'Erro!',
        template: 'Login Falhou'
      });
    })
  }
})
