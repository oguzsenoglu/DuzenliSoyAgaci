var Soy_App = angular.module("App_SoyAgaci", ['ngSanitize']);
Soy_App.controller("CTRL_SoyAgaci", ['$scope', '$http', function ($scope, $http) {
    $scope.Now_Date = new Date();

    $scope.Yardim = function () {
        $('#MODAL_Yardim').modal('open');
      }

    $scope.detayEkrani = function (soySirasi) {
        $scope.detayliBilgisi = [];
        angular.forEach($scope.DuzenliSoyBilgileri, function (value) {
            if (value.SIRA == soySirasi) {
                $scope.detay_AdiSoyadi = value.ADI + ' ' + value.SOYADI;
                $scope.detay_Yakinlik = value.YAKINLIK_DERECESI;
                $scope.detay_BabaAdi = value.BABA_ADI;
                $scope.detay_AnneAdi = value.ANNE_ADI;
                $scope.detay_DogumYeri = value.DOGUM_YERI;
                $scope.detay_DogumTarihi = value.DOGUM_TARIHI;
                $scope.detay_Il_Ilce_Mahalle = value.IL_ILCE;
                $scope.detay_Durum = value.DURUMU;
                $scope.detay_OlumTarihi = value.OLUM_TARIHI;
                $scope.detay_Yas = value.YASI;
                $scope.detay_MedeniHali = value.MEDENI_HALI;
                $scope.detay_CiltHane = value.CILT_HANE;
                $scope.detay_Cinsiyet = value.CINSIYET;
            }
        });
        $('#MODAL_detayliBilgi').modal('open');
    }


    $scope.showContent = function ($fileContent) {
        $scope.content = $fileContent;

        var kontrolSoy = $scope.content.indexOf("resultTable striped");
    
        if(kontrolSoy == -1) {
            $scope.btn_Cevir_Dosya_Kontrol = false;
            var toastHTML = '<span><i class="material-icons left">close</i>E-Devlet soy sorgulama sayfası değil</span>';
            M.toast({ html: toastHTML, classes: 'red' });
        }
        else{
            $scope.btn_Cevir_Dosya_Kontrol = true;
        }

        
    };

    $scope.Cevir = function () {
        var table = $('.resultTable').tableToJSON();
        //$scope.JsonCevir = table;

        $scope.JsonCevir = [];
        $('.resultTable tr').each(function (i, n) {
            var $row = $(n);
            $scope.JsonCevir.push({
                sira: $row.find('td:eq(0)').text(),
                cinsiyet: $row.find('td:eq(1)').text(),
                yakinlik: $row.find('td:eq(2)').text(),
                adi: $row.find('td:eq(3)').text(),
                soyadi: $row.find('td:eq(4)').text(),
                baba_adi: $row.find('td:eq(5)').text(),
                ana_adi: $row.find('td:eq(6)').text(),
                dogumYeri_Tarihi: $row.find('td:eq(7)').html(),
                il_Ilce: $row.find('td:eq(8)').html(),
                cilt_hane: $row.find('td:eq(9)').html(),
                medeni_hali: $row.find('td:eq(10)').html(),
                durumu_OlumTarihi: $row.find('td:eq(11)').html()
            });

        });

        $scope.JsonCevir.splice(0, 1);
        $scope.JsonCevir.splice(-1, 1);
        $scope.JsonCevir.splice(-1, 1);

        $scope.DuzenliSoyBilgileri = [];
        var Dogum = "";
        var Olum = "";
        var simdikiTarih = moment($scope.Now_Date).lang('tr').format('YYYY-MM-DD');

        angular.forEach($scope.JsonCevir, function (value) {
            if (value.il_Ilce) {
                $scope.il_Ilce = value.il_Ilce.replace("<br>", "");
                $scope.il_Ilce = $scope.il_Ilce.replace("<br>", "");
            }

            if (value.dogumYeri_Tarihi) {
                $scope.DogumYeri = value.dogumYeri_Tarihi.split('<br>')[0];
                $scope.DogumTarihi = value.dogumYeri_Tarihi.split('<br>')[1];

                Dogum = moment($scope.DogumTarihi, 'DD/MM/YYYY').format('YYYY-MM-DD');
                Dogum = moment(Dogum);
            }
            if (value.durumu_OlumTarihi) {
                $scope.Durumu = value.durumu_OlumTarihi.split('<br>')[0];
                $scope.OlumTarihi = value.durumu_OlumTarihi.split('<br>')[1];
                if ($scope.Durumu == "Sağ" && $scope.OlumTarihi == "-") {
                    Olum = moment(simdikiTarih);
                } else {
                    Olum = moment($scope.OlumTarihi, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    Olum = moment(Olum);
                }
            }

            $scope.Yasi = Olum.diff(Dogum, 'year');

            $scope.DuzenliSoyBilgileri.push({
                SIRA: value.sira,
                YAKINLIK_DERECESI: value.yakinlik,
                ADI: value.adi,
                SOYADI: value.soyadi,
                CINSIYET: value.cinsiyet,
                BABA_ADI: value.baba_adi,
                ANNE_ADI: value.ana_adi,
                DOGUM_YERI: $scope.DogumYeri,
                DOGUM_TARIHI: $scope.DogumTarihi,
                OLUM_TARIHI: $scope.OlumTarihi,
                DURUMU: $scope.Durumu,
                YASI: $scope.Yasi,
                MEDENI_HALI: value.medeni_hali,
                CILT_HANE: value.cilt_hane,
                IL_ILCE: $scope.il_Ilce
            });
        });

        angular.forEach($scope.DuzenliSoyBilgileri, function (value) {
            switch (value.YAKINLIK_DERECESI) {
                case 'Kendisi':
                    $scope.kendi_Adi = value.ADI + " " + value.SOYADI;
                    $scope.kendi_Adi_ID = value.SIRA;
                    $scope.kendi_cinsiyet = value.CINSIYET;
                    break;

                // Baba Tarafı //
                case 'Babası':
                    $scope.Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesi':
                    $scope.Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babası':
                    $scope.Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesi':
                    $scope.Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesi':
                    $scope.Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babası':
                    $scope.Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesinin Babası':
                    $scope.Babasinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesinin Annesi':
                    $scope.Babasinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Babası':
                    $scope.Babasinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Annesi':
                    $scope.Babasinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Annesinin Annesi':
                    $scope.Babasinin_Babasinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Annesinin Babası':
                    $scope.Babasinin_Babasinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Babasının Annesi':
                    $scope.Babasinin_Babasinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesinin Babasının Annesi':
                    $scope.Babasinin_Babasinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesinin Babasının Babası':
                    $scope.Babasinin_Babasinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Babasının Babasının Babası':
                    $scope.Babasinin_Babasinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Babasının Annesinin Annesinin Babası':
                    $scope.Babasinin_Babasinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Babasinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesi':
                    $scope.Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babası':
                    $scope.Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Annesi':
                    $scope.Babasinin_Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Annesi':
                    $scope.Babasinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Babası':
                    $scope.Babasinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Babası':
                    $scope.Babasinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Annesinin Annesi':
                    $scope.Babasinin_Annesinin_Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Annesinin Annesi':
                    $scope.Babasinin_Annesinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Annesinin Babası':
                    $scope.Babasinin_Annesinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Babasının Babası':
                    $scope.Babasinin_Annesinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Babasının Babasının Annesi':
                    $scope.Babasinin_Annesinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Annesinin Babasi':
                    $scope.Babasinin_Annesinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Babasının Annesi':
                    $scope.Babasinin_Annesinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Babasının Annesinin Annesinin Babasının Babası':
                    $scope.Babasinin_Annesinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Babasinin_Annesinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                // Baba Tarafı //


                // Anne Tarafı //
                case 'Annesi':
                    $scope.Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesi':
                    $scope.Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babası':
                    $scope.Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesi':
                    $scope.Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babası':
                    $scope.Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Babası':
                    $scope.Annesinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Annesi':
                    $scope.Annesinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Babası':
                    $scope.Annesinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Annesi':
                    $scope.Annesinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Annesinin Annesi':
                    $scope.Annesinin_Babasinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Annesinin Babası':
                    $scope.Annesinin_Babasinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Babasının Annesi':
                    $scope.Annesinin_Babasinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Babasının Annesi':
                    $scope.Annesinin_Babasinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Babasının Babası':
                    $scope.Annesinin_Babasinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Annesinin Babası':
                    $scope.Annesinin_Babasinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Annesinin Annesinin Annesi':
                    $scope.Annesinin_Babasinin_Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Babasının Babasının Babasının Babası':
                    $scope.Annesinin_Babasinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Babasinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesi':
                    $scope.Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babası':
                    $scope.Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Annesi':
                    $scope.Annesinin_Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Annesi':
                    $scope.Annesinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Babası':
                    $scope.Annesinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Babası':
                    $scope.Annesinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Annesinin Annesi':
                    $scope.Annesinin_Annesinin_Annesinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Annesinin Annesi':
                    $scope.Annesinin_Annesinin_Babasinin_Annesinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Annesinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Annesinin Babası':
                    $scope.Annesinin_Annesinin_Babasinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Babasının Babası':
                    $scope.Annesinin_Annesinin_Babasinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Babasının Babasının Annesi':
                    $scope.Annesinin_Annesinin_Babasinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Babasinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Annesinin Babasi':
                    $scope.Annesinin_Annesinin_Annesinin_Annesinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Annesinin_Babasi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Babasının Annesi':
                    $scope.Annesinin_Annesinin_Annesinin_Babasinin_Annesi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Babasinin_Annesi_ID = value.SIRA;
                    break;
                case 'Annesinin Annesinin Annesinin Babasının Babası':
                    $scope.Annesinin_Annesinin_Annesinin_Babasinin_Babasi = value.ADI + " " + value.SOYADI;
                    $scope.Annesinin_Annesinin_Annesinin_Babasinin_Babasi_ID = value.SIRA;
                    break;
                // Anne Tarafı //
            }
        });


        var toastHTML = '<span><i class="material-icons left">check</i>Soy ağacı başarıyla oluşturuldu.</span>';
        M.toast({ html: toastHTML, classes: 'green' });

    };
}]);




Soy_App.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            element.on('change', function (onChangeEvent) {
                
                var reader = new FileReader();
                reader.onload = function (onLoadEvent) {

                    scope.$apply(function () {
                        fn(scope, { $fileContent: onLoadEvent.target.result });
                    });
                };
                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

Soy_App.filter('ifEmpty', function () {
    return function (input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
});