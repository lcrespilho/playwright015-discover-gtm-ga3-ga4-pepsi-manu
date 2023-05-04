// https://docs.google.com/spreadsheets/d/1KLCGvbwAMn8cl95DmHef1Pj9PUNoqhsCUMbYqqxLF9g/edit#gid=1224947211
// checa GTM, GA e GAM/GPT

import { chromium, type Request } from 'playwright';
import c from 'ansi-colors';
import fs from 'fs';
import { taskQueue } from '@lcrespilho/async-task-queue';
import { Site, flatRequestUrl, jsonarray2csv } from './common';
import sitesJson from './sites.json';

const TaskQueue = taskQueue(process.env.CONCURRENCY || 20);

let sites: Site[] = [
  {
    url: 'louren.co.in/redirect302/redirect301/www.example.com',
    gtms: [],
    ga3Properties: [],
    ga4Properties: [],
    error: '',
    visited: false,
    redirects: [],
  },
  { url: 'mueveloconpepsi.com' },
  { url: 'promopepsi.com.ar' },
  { url: 'doritos.com.br' },
  { url: 'gatorade.com.br' },
  { url: 'mabel.com.br' },
  { url: 'campoaopacote.lays.com.br' },
  { url: 'sumalesabor.com' },
  { url: 'tussnacksfavoritos.com' },
  { url: 'fritolaypromotion.com' },
  { url: 'fritolaysnacks.com.pe' },
  { url: 'rankeatedoritos.com' },
  { url: 'clipsy.rs' },
  { url: 'pepsi.at' },
  { url: 'pepsicoicecek.com.tr' },
  { url: '7up.fr' },
  { url: 'alvalle.fr' },
  { url: 'fruko.com.tr' },
  { url: 'lays.hu' },
  { url: 'lays.it' },
  { url: 'swietujzlaysipepsi.pl' },
  { url: 'pepsi.fr' },
  { url: 'quaker.fr' },
  { url: 'gewinnen-mit-punica.de' },
  { url: 'lipton-probier-mich.de' },
  { url: 'mountaindew.se' },
  { url: 'lays-images.com' },
  { url: 'pepsi.si' },
  { url: 'pepsimax.it' },
  { url: 'simba.co.za' },
  { url: 'cms.dothedewsaudi.com' },
  { url: 'liquifruit.co.za' },
  { url: 'win.redrockdeli.com.au' },
  { url: 'summerpromo.pepsimax.com.au' },
  { url: 'quaker.com.my' },
  { url: 'pepsico.com.pk' },
  { url: 'pepsirecycled.com' },
  { url: 'marmite.co.za' },
  { url: 'moirs.co.za' },
  { url: 'khouseofpepsi.com' },
  { url: 'dothedewsaudi.com' },
  { url: 'pocavietnam.com' },
  { url: 'admin-panel.pocavietnam.com' },
  { url: 'duetdogry.pl' },
  { url: 'ganapremiosconkfcypepsimax.es' },
  { url: 'media.pepsico.com' },
  { url: 'websitecontrolcenter.pepsico.com' },
  { url: 'api.brasil3kmpepsi.com' },
  { url: 'api.3kmpepsi.com' },
  { url: 'rockstarsummer.com' },
  { url: 'smithstasteicons.com.au' },
  { url: 'obela.mx' },
  { url: 'promocionespepsico.com' },
  { url: 'pepsilollacl.com' },
  { url: 'pepsicr.com' },
  { url: 'salvandolochapin.com' },
  { url: 'pepsi.cl' },
  { url: 'gssilatam.org' },
  { url: 'mialmacenero.cl' },
  { url: 'promocionespepsicolatam.com' },
  { url: 'actitudverano.cl' },
  { url: 'eshoradefutbol.com' },
  { url: 'elbotinfritolay.com' },
  { url: 'scratchtogreatness.com' },
  { url: 'theideatory.com' },
  { url: 'pepsicoideatory.com' },
  { url: 'sunbites.mx' },
  { url: 'querovenderpepsico.com.br' },
  { url: 'laysfutbol.com' },
  { url: 'tostitos.com.pe' },
  { url: 'unlockthesmiles.com' },
  { url: 'chesterdrop.com' },
  { url: 'pepsigoldengiveaway.com' },
  { url: 'be.pepsimovietime.gr' },
  { url: 'pepsi.tumblr.com' },
  { url: 'gatoradesportsshop.com' },
  { url: 'freetheessence.com.br' },
  { url: 'doritosticketoffer.com' },
  { url: 'liptonicedteaday.com' },
  { url: 'gatoradefootball.com' },
  { url: 'gatoradeendurance.com' },
  { url: 'fuelyourwaytothechampionship.com' },
  { url: 'gatoradebigten.com' },
  { url: 'sweatearnschampionships.com' },
  { url: 'fueltomorrowcfb.gatorade.com' },
  { url: 'mtndew.live' },
  { url: 'dewventure.com' },
  { url: 'starrywalmart.com' },
  { url: 'pepsi.brandmovers.co' },
  { url: 'gametimewithquaker.com' },
  { url: 'cle.mypepsico.com' },
  { url: 'pepsisportsentry.com' },
  { url: 'innovationhub.mypepsico.com' },
  { url: 'pepsipromos.com' },
  { url: 'pepsipayzero.com' },
  { url: 'drinkbolt24.ca' },
  { url: 'gatoradefuelyourgame.com' },
  { url: 'upgradeyourstrength.com' },
  { url: 'gatorade5v5.com' },
  { url: 'preparatecontodo.com' },
  { url: 'veranomashot.com' },
  { url: 'fritolaypanama.com' },
  { url: 'chokis.com.co' },
  { url: 'passport.pepsidigin.com' },
  { url: 'pepsicojuntoscrecemos.com' },
  { url: 'starrynbasweeps.com' },
  { url: 'tastytoobs.com.au' },
  { url: 'misttwst.com' },
  { url: 'calebskola.com' },
  { url: 'lemonlemonsparkling.com' },
  { url: 'pepsicares.com' },
  { url: 'pepsihalftime.com' },
  { url: 'giesabreak.scottsporage.com' },
  { url: 'kibicujzlays.lays.pl' },
  { url: 'cheetos.be' },
  { url: 'piperscrispsexport.com' },
  { url: 'menu.pepsimax-lays.com' },
  { url: 'pepsimax-lays.com' },
  { url: 'copellafruitjuices.co.uk' },
  { url: 'cruesli.be' },
  { url: 'cruesli.nl' },
  { url: 'konkurscheetos.pl' },
  { url: 'nakedjuice.fr' },
  { url: 'nobbys.co.uk' },
  { url: 'pepsi.se' },
  { url: 'pepsifootball.com.mt' },
  { url: 'tasteusloveus.com' },
  { url: 'tostitos.co.uk' },
  { url: 'tropicanajuice.dk' },
  { url: 'veranopepsimax.com' },
  { url: 'walkers-snacks.co.uk' },
  { url: 'cheetos.nl' },
  { url: 'filmyzlays.lays.pl' },
  { url: 'kibicepepsi.pl' },
  { url: 'konkursurodzinowy.pl' },
  { url: 'navidadpepsimax.com' },
  { url: 'promocjastar.pl' },
  { url: 'punica-images.com' },
  { url: 'scottsporage.com' },
  { url: 'wakacyjnenagrody.pl' },
  { url: 'zabawazcheetos.pl' },
  { url: 'konkurspepsi.pl' },
  { url: 'latozlipton.pl' },
  { url: 'letnialoteria.pepsi.pl' },
  { url: 'letnieduety.pl' },
  { url: 'lipton-images.com' },
  { url: 'pepsi-images.com' },
  { url: 'rockstar-images.com' },
  { url: 'cheerforourhour.com' },
  { url: 'meanwhileinthepepsi-verse.com' },
  { url: 'quaker.com.hk' },
  { url: 'freethebirdnz.com' },
  { url: 'tostitos.co.nz' },
  { url: 'latozlays.pl' },
  { url: 'konkursnawakacje.pl' },
  { url: 'pepsi-max-tastechallenge-app.com' },
  { url: 'pepsifootball.com' },
  { url: 'theblackartrising.com' },
  { url: 'darrnudaraa.mountaindew.in' },
  { url: 'pepsico.lat' },
  { url: 'quaker.cl' },
  { url: 'raices.cl' },
  { url: 'loteriapilkarska.pepsi.pl' },
  { url: 'konkursfilmowy.pepsi.pl' },
  { url: 'layssverige.se' },
  { url: 'cytosport.com' },
  { url: 'monstermilk.com' },
  { url: 'getoutsidewithevolve.com' },
  { url: 'account.pepsico.com' },
  { url: 'greenlabelexclusives.com' },
  { url: 'pepsicomomentstosave.com' },
  { url: 'playultimatematchup.com' },
  { url: 'pepsirocksnow.com' },
  { url: 'dietpepsi.com' },
  { url: 'fbfoodservice.pepsi.com' },
  { url: 'gamedayofficial.com' },
  { url: 'pepsianthems.com' },
  { url: 'hypedforhalftime.com' },
  { url: 'kickstart.mountaindew.com' },
  { url: 'green-label.com' },
  { url: 'pepsichallenge.com' },
  { url: 'sitios.univision.com' },
  { url: 'sobeunderthecap.com' },
  { url: 'projectcobalt.com' },
  { url: 'bemoreteafestival.com' },
  { url: 'doubleshotpromo.com' },
  { url: 'pepsportsrewards.com' },
  { url: 'shop.pepsi.com' },
  { url: 'savorthesunrise.com' },
  { url: 'therecipe.pepsi.com' },
  { url: 'pepsiupforgrabs.com' },
  { url: 'hoistthecup.pepsi.ca' },
  { url: 'oneupyourhydration.com' },
  { url: 'marketingmavenawards.pepsico.com' },
  { url: 'pepsifunsweepstakes.com' },
  { url: 'pepsiandtostitos.com' },
  { url: 'pepsipopupshop.com' },
  { url: 'uncledrew.com' },
  { url: 'dgrewards.com' },
  { url: 'mtndewhoops.com' },
  { url: 'pepsifiresweepstakes.com' },
  { url: 'pepsisummerprizesweeps.com' },
  { url: 'pepsipicksix.com' },
  { url: 'nakedjuice.ca' },
  { url: 'sgquakerchef.com' },
  { url: 'dewanddoritos.ca' },
  { url: 'dalecall.mountaindew.com' },
  { url: 'mtndewapp.com' },
  { url: 'mountaindewtakeitoutside.com' },
  { url: 'mtndewrewards.com' },
  { url: 'dewinstantscore.com' },
  { url: 'dewnationrewards.com' },
  { url: 'closerthancourtside.mountaindew.com' },
  { url: 'dewnited.com' },
  { url: 'mtndewtr.com' },
  { url: 'dewoutdoors.com' },
  { url: 'hyveedewoutdoor.com' },
  { url: 'lifechangingdew.com' },
  { url: 'dewoutdoorguides.com' },
  { url: 'dewoutdoorgrants.com' },
  { url: 'kumandplaymajormelon.com' },
  { url: 'circlekcallofduty.com' },
  { url: 'dewreptheland.com' },
  { url: 'mountaindewflavorslam.com' },
  { url: 'ledodewflavorslam.com' },
  { url: 'treasuresofbajaisland.com' },
  { url: 'greattastezerosugar.ca' },
  { url: 'excellentgoutzerosucre.ca' },
  { url: 'dewxpapajohns.com' },
  { url: 'littlecaesarscallofduty.ca' },
  { url: 'mtndewnba2k23.com' },
  { url: 'readysetsummersweeps.com' },
  { url: 'icipepsi.ca' },
  { url: 'bwwpepsifantasydraft.com' },
  { url: 'pepsiiheartkangaroo.com' },
  { url: 'pepsiiheartquiktrip.com' },
  { url: 'pepsiiheart.com' },
  { url: 'foodliondewshop.com' },
  { url: 'dewsummergrilling.com' },
  { url: 'pepsipatriots.com' },
  { url: 'pepsihalftimetrip.com' },
  { url: 'dewtasteofthemountain.com' },
  { url: 'thedewgeneralstore.com' },
  { url: 'pepsicmafest.com' },
  { url: 'dewmarchsweeps.com' },
  { url: 'pepsimaxhouse.com' },
  { url: 'snacksharesave.com' },
  { url: 'pepsitastechallenge.com' },
  { url: 'pjpizzapepsirocks.com' },
  { url: 'pepsicoafh2015.com' },
  { url: 'drinkaloha.com' },
  { url: 'pepsistrikegold.com' },
  { url: 'squad.mountaindew.com' },
  { url: 'pepsi50tix.com' },
  { url: 'pepsi50ksweeps.com' },
  { url: 'dewchampionships.com' },
  { url: 'pepsidoritoscodes.com' },
  { url: 'pepsisummerfun.com' },
  { url: 'pepsicoculinarystudio.com' },
  { url: 'premierethefun.com' },
  { url: 'mtndewstop.com' },
  { url: 'pepsiwonderlandatdg.com' },
  { url: 'lcpepsisweeps.com' },
  { url: 'pepsiwalmartsweepstakes.com' },
  { url: 'pepsirockthisway.com' },
  { url: 'pepsitunes.com' },
  { url: 'pepsiallstar.com' },
  { url: 'pepsisodexofootballfan.com' },
  { url: 'mtndewski.com' },
  { url: 'pepsitakeittothehouse.com' },
  { url: 'dewthe99.com' },
  { url: 'pureleafsweeps.com' },
  { url: 'sodexobublyss.com' },
  { url: 'pepsiplaylist.com' },
  { url: 'bandsandbiscuits.com' },
  { url: 'mountaindewportal.com' },
  { url: 'halftimeshowsweeps.com' },
  { url: 'bublymatchgame.com' },
  { url: 'pepsifreeze.com' },
  { url: 'madeforfootballwatching.com' },
  { url: 'dolejuice.com' },
  { url: 'flaminhot.com' },
  { url: 'pepsisuperbowl.com' },
  { url: 'pepsirandysdonuts.com' },
  { url: 'izzeguarantee.com' },
  { url: 'stackyourwins.musclemilk.com' },
  { url: 'pepsistuff.ca' },
  { url: 'pepsiroyals50.com' },
  { url: 'summerofpepsi.com' },
  { url: 'gatoradegear.ca' },
  { url: 'pepsisummer.com' },
  { url: 'crunch-bowl.com' },
  { url: 'giftwithpepsi.com' },
  { url: 'dewoutpost.com' },
  { url: 'spotthebuble.com' },
  { url: 'rushintowin.com' },
  { url: 'yearofdew.com' },
  { url: 'pepsisummergram.com' },
  { url: 'unstoppablepride.com' },
  { url: 'doritoslegionofthebold.com' },
  { url: 'pepsiplays.com' },
  { url: 'bublyholidaycheer.com' },
  { url: 'gearupforgameday.com' },
  { url: 'briskzerodrop.com' },
  { url: 'dewstockupsweeps.com' },
  { url: 'bublyholidaysweaters.com' },
  { url: 'pepsihalftimeshow.com' },
  { url: 'fullofdetroitsoul.com' },
  { url: 'rockstarrockon.com' },
  { url: 'drinkfrutly.com' },
  { url: 'neonzebramixers.com' },
  { url: 'moresmileswitheverysip.com' },
  { url: 'rockstarrisegame.com' },
  { url: 'pepsipassport.com' },
  { url: 'pepsiitsanewyorkthing.com' },
  { url: 'propelsweeps.com' },
  { url: 'pepsivista.com' },
  { url: 'madeforbengalswatching.com' },
  { url: 'madeforbillswatching.com' },
  { url: 'madeforcowboyswatching.com' },
  { url: 'madefordolphinswatching.com' },
  { url: 'madeforeagleswatching.com' },
  { url: 'madeforgiantswatching.com' },
  { url: 'madeforjaguarswatching.com' },
  { url: 'madeforjetswatching.com' },
  { url: 'madeforlionswatching.com' },
  { url: 'madeforpatriotswatching.com' },
  { url: 'madeforsteelerswatching.com' },
  { url: 'madeforvikingswatching.com' },
  { url: 'madeforwashingtonfootballwatching.com' },
  { url: 'rockstarenergycountry.com' },
  { url: 'driveforpepsi.com' },
  { url: 'sipnowsavelater.com' },
  { url: 'liveunmuddled.com' },
  { url: 'iam.fullofdetroitsoul.com' },
  { url: 'pepsisodashop.com' },
  { url: 'pepsisipsnacktoss.com' },
  { url: 'challenge.pepsicorecycling.com' },
  { url: 'turnupyourmood.com' },
  { url: 'vamosfootball2022.com' },
  { url: 'liptoninstantwin.com' },
  { url: 'winpepsipopstar.com' },
  { url: 'tropicanacrunch.com' },
  { url: 'bayasweeps.com' },
  { url: 'nitropepsiwalmart.com' },
  { url: 'lifewtr100days.com' },
  { url: 'givebackjamon.com' },
  { url: 'musclemilkliftingproject.com' },
  { url: 'rockstarprizes.ca' },
  { url: 'prixrockstar.ca' },
  { url: 'pepsinyc.com' },
  { url: 'rockstarbelieveit.com' },
  { url: 'biggestpartyinthesouth.com' },
  { url: 'bublywfhawaii.com' },
  { url: 'rockstarenergysportvehicle.com' },
  { url: 'starbucksbayaenergysweeps.com' },
  { url: 'pzsproexperience.com' },
  { url: 'liptonfootballsweeps.com' },
  { url: 'thedewzonesweeps.com' },
  { url: 'samsclubcafe.chipsnsips.com' },
  { url: 'pepsisummergiveaway.com' },
  { url: 'winsummer.ca' },
  { url: 'pepsigamedaypromo.com' },
  { url: 'bayaelectricbikesweeps.com' },
  { url: 'pepsitailgate.com' },
  { url: 'rockstarenergyxbox.ca' },
  { url: 'rockstarenergisantexbox.ca' },
  { url: 'wawaeaglessweeps.com' },
  { url: 'stackyoursleigh.ca' },
  { url: 'remplissezvotretraineau.ca' },
  { url: 'pepsigamedaycookoff.com' },
  { url: 'lucky.com.br' },
  { url: 'toddy.com.br' },
  { url: 'snacks.cl' },
  { url: 'pepsicochangecompass.com' },
  { url: 'pepbridge.pepsicodigital.com' },
  { url: 'events.pepsico.com' },
  { url: 'pepsicouxcoe.com' },
  { url: 'consumer2030pepsislider.com' },
  { url: 'climatesimulator.pepsico.com' },
  { url: 'toddy.cl' },
  { url: 'cheetos.mx' },
  { url: 'chestercheetos.com.mx' },
  { url: 'chestercheetos.mx' },
  { url: 'chewy.mx' },
  { url: 'churrumais.com.mx' },
  { url: 'churrumais.mx' },
  { url: 'crackets.com' },
  { url: 'crackets.mx' },
  { url: 'crujitos.mx' },
  { url: 'fritos.mx' },
  { url: 'habaneras.mx' },
  { url: 'hummus.mx' },
  { url: 'kacang.mx' },
  { url: 'mamutmamut.com' },
  { url: 'mancha-t.mx' },
  { url: 'manchat.com.mx' },
  { url: 'manchat.mx' },
  { url: 'marias.com.mx' },
  { url: 'mariasgamesa.com.mx' },
  { url: 'mariasgamesa.mx' },
  { url: 'milch.com.mx' },
  { url: 'milch.mx' },
  { url: 'obelamex.com.mx' },
  { url: 'obelamexico.com.mx' },
  { url: 'paketaxo.mx' },
  { url: 'papassabritas.mx' },
  { url: 'poffets.mx' },
  { url: 'ruffles.mx' },
  { url: 'sabritas.mx' },
  { url: 'saladitas.mx' },
  { url: 'tostitos.mx' },
  { url: 'churrumais.com' },
  { url: 'crujitos.com' },
  { url: 'emperador.mx' },
  { url: 'emperadorgamesa.com' },
  { url: 'gamesaclasicas.com' },
  { url: 'kkwates.com' },
  { url: 'paketaxo.com' },
  { url: 'papassabritas.com' },
  { url: 'rancheritos.com' },
  { url: 'chestercheetos.com' },
  { url: 'hazloconquaker.com' },
  { url: 'cheetos.cl' },
  { url: 'lays.com.br' },
  { url: 'ruffles.com.br' },
  { url: 'rancheritos.mx' },
  { url: 'doritos.cl' },
  { url: 'retrosnacks.cl' },
  { url: 'lays.cl' },
  { url: 'gatorade.cl' },
  { url: 'chester.cl' },
  { url: 'chispop.cl' },
  { url: 'fritolay.cl' },
  { url: 'nachos.cl' },
  { url: 'ramitas.cl' },
  { url: 'snack.cl' },
  { url: 'gatoraderunning.lat' },
  { url: 'campanhatoptime.com.br' },
  { url: 'stax.cl' },
  { url: 'participedoplanetlove.com' },
  { url: 'briskmode.com' },
  { url: 'poppables.com' },
  { url: 'drinkfinity.co.de' },
  { url: 'gatorade.tumblr.com' },
  { url: 'gatoradehat.com' },
  { url: 'apps.facebook.com' },
  { url: 'culversyellowstone.com' },
  { url: 'culverspuzzleadventure.com' },
  { url: 'culversadventure.com' },
  { url: 'culversholidaysweeps.com' },
  { url: 'dewnitedwalmart.com' },
  { url: 'pepsibaseball.com' },
  { url: 'chooseyourheat.com' },
  { url: 'pepfeed.mypepsico.com' },
  { url: 'cookwithquaker.com' },
  { url: 'rockstarextramilesweeps.com' },
  { url: 'pepsibaseballsweeps.com' },
  { url: 'oatauthority.tumblr.com' },
  { url: 'lays.fr' },
  { url: 'pepsico-pro.fr' },
  { url: 'recettes.quaker.fr' },
  { url: 'pepsico-foodservice.fr' },
  { url: 'quakerarabia.com' },
  { url: 'spekkorice.co.za' },
  { url: 'sasko.co.za' },
  { url: 'flavorsplash.com' },
  { url: 'weareblood.com' },
  { url: 'yachak.com' },
  { url: 'elmachips.com.br' },
  { url: 'pastagrande.co.za' },
  { url: 'winkler-jewelry.com' },
  { url: 'maizoro.com.mx' },
  { url: 'pepsicoschoolsource.com' },
  { url: 'musclemilk.com' },
  { url: 'piperscrisps.com' },
  { url: 'fritolay.com.tr' },
  { url: 'conquista-bares.com' },
  { url: 'gatorade.at' },
  { url: 'pepsiconcorsi.it' },
  { url: 'pidepepsimax.es' },
  { url: 'meconsumerfeedback.com' },
  { url: 'smiths-chips.com.au' },
  { url: 'pepsi.in' },
  { url: 'pioneerfoods.co.za' },
  { url: 'pepsicotaiwan.com' },
  { url: 'brasil3kmpepsi.com' },
  { url: 'waterdispenserstandard.com' },
  { url: 'funyuns.com' },
  { url: 'moresmileswitheverybite.com' },
  { url: 'fritolayemployment.com' },
  { url: 'quaker.co.id' },
  { url: 'popcorners.com.au' },
  { url: 'pepsico.cl' },
  { url: 'fritolayhoops.com' },
  { url: 'wheeloflevy.com' },
  { url: 'drinkfinity.com.br' },
  { url: 'pepsicoteamofchampions.com' },
  { url: 'foundedbyher.org' },
  { url: 'dolelemonade.com' },
  { url: 'popcorners.com' },
  { url: 'pepsico.co.uk' },
  { url: 'chewy.com.mx' },
  { url: 'kkwates.com.mx' },
  { url: 'mamutmamut.com.mx' },
  { url: 'mancha-t.com.mx' },
  { url: 'quaker.mx' },
  { url: 'rockaleta.mx' },
  { url: 'ceresfruitjuice.com' },
  { url: 'gatorade.com.co' },
  { url: 'fundacionsabritas.org.mx' },
  { url: 'portalproveedorespepsico.com' },
  { url: 'participaconpepsico.com' },
  { url: 'pepsiinteractivevending.com' },
  { url: 'drinkfinity.co.uk' },
  { url: 'earnfootballgear.com' },
  { url: 'doritosspiderman.com' },
  { url: 'dummy.com' },
  { url: 'pepsihootersweeps.com' },
  { url: 'toysfortots.org' },
  { url: 'sodastream.com.br' },
  { url: 'drinkstation.com' },
  { url: 'secretsantapromo.com.au' },
  { url: 'packsnackwin.com.au' },
  { url: '7up.com' },
];

// Continua de onde parou.
if (JSON.stringify(sitesJson) !== '[]') sites = sitesJson as Site[];

(async () => {
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS === 'true',
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: null,
    // viewport: {
    //   width: 1700,
    //   height: 900,
    // },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    storageState: 'state.json',
  });

  context.setDefaultTimeout(60000);

  await Promise.all(
    sites
      .filter(site => !site.visited)
      //.slice(0, 100)
      .map(site =>
        TaskQueue.push(async done => {
          try {
            console.log(c.blue(site.url));
            site.gtms = site.gtms || [];
            site.ga3Properties = site.ga3Properties || [];
            site.ga4Properties = site.ga4Properties || [];
            site.error = '';
            site.visited = false;
            site.redirects = site.redirects || [];
            const page = await context.newPage();
            await page.waitForTimeout(1000); // tempo para abertura do DevTools

            // Captura IDs de GTM e GA.
            page.on('request', async (req: Request) => {
              try {
                // Só considera requisições feitas pelo top frame.
                // Precisei criar essa regra porque, em alguns casos, recursos embedados
                // não relacionadods com a página estavam carregando GA. Preciso excluir
                // esses casos.
                const flatUrl = flatRequestUrl(req);
                const headers = req.headers();
                const referrerHost = headers.referer ? new URL(headers.referer).host : undefined;
                const topHost = new URL(page.url()).host;
                if (referrerHost && topHost !== referrerHost) return; // só considera requisições feitas pelo top frame

                // Detecção dos GTMs
                if (/^https?:\/\/(www\.)?googletagmanager\.com\/gtm\.js\?id=GTM-/.test(flatUrl)) {
                  const gtm = flatUrl.match(/GTM-\w+/)![0];
                  if (!site.gtms!.includes(gtm)) {
                    site.gtms!.push(gtm);
                  }
                }

                // Detecção das propriedades de GA3
                else if (/^https:\/\/(www\.google-analytics|analytics\.google\.com).*collect\?v=1/.test(flatUrl)) {
                  const tid = new URL(flatUrl).searchParams.get('tid')!;
                  if (!tid.startsWith('UA-')) return;
                  if (!site.ga3Properties!.includes(tid)) {
                    site.ga3Properties!.push(tid);
                  }
                }

                // Detecção das propriedades de GA4
                else if (/^https:\/\/(www\.google-analytics|analytics\.google\.com).*collect\?v=2/.test(flatUrl)) {
                  const tid = new URL(flatUrl).searchParams.get('tid')!;
                  if (!tid.startsWith('G-')) return;
                  if (!site.ga4Properties!.includes(tid)) {
                    site.ga4Properties!.push(tid);
                  }
                }
              } catch (error) {
                console.log(c.red('Erro em page.on("request"): '), (error as Error).message);
                site.error += 'Erro em page.on("request"): ' + (error as Error).message.replace(/[\n,]/g, '_');
              }
            });

            // NAVEGAÇÃO
            let request: Request | null;
            try {
              // navegação via https
              request = (await page.goto(`https://${site.url}`, { waitUntil: 'domcontentloaded' }))?.request()!;
            } catch (error) {
              // navegação via http
              request = (await page.goto(`http://${site.url}`, { waitUntil: 'domcontentloaded' }))?.request()!;
            }
            // bloco para capturar possíveis redirects
            {
              let previousRequest: Request | null = request;
              site.redirects.push(request.url());
              while ((previousRequest = previousRequest.redirectedFrom())) {
                site.redirects.push(previousRequest.url());
              }
              site.redirects.pop();
              site.redirects.reverse();
            }
            if (process.env.HEADLESS === 'false') await page.waitForTimeout(30000); // tempo para clicar em banners de cookie, etc
            // Simula interação para forçar o carregamento de GTM/analytics em sites lazy.
            {
              await page.mouse.move(100, 100, { steps: 3 });
              await page.hover('body', { position: { x: 200, y: 150 }, timeout: 4000 }).catch(() => {});
              await page.waitForLoadState('load');
              await page.evaluate(() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth',
                });
              });
              await page.waitForTimeout(5000);
              await page.evaluate(() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              });
            }
            await page.waitForTimeout(1000);
            await page.close();
            site.visited = true;
          } catch (error) {
            console.log(c.red('Error on navigation:'), (error as Error).message);
            site.error += 'Erro na navegação: ' + (error as Error).message.replace(/[\n,]/g, '_');
            site.visited = true;
          }
          done(); // sinaliza que a task terminou
        })
      )
  );

  const csv = jsonarray2csv(sites);

  // provavelmente eu abri manualmente todos os sites e cliquei nos aceites de cookies, etc
  await context.storageState({ path: 'state.json' });
  await context.close();
  await browser.close();

  fs.writeFileSync('discover.csv', csv, 'utf8'); // saída para o sheets

  fs.writeFileSync('sites.json', JSON.stringify(sites), 'utf8'); // salva o progresso
})();
