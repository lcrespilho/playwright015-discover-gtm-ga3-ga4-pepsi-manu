// https://docs.google.com/spreadsheets/d/1KLCGvbwAMn8cl95DmHef1Pj9PUNoqhsCUMbYqqxLF9g/edit#gid=1224947211
// checa GTM, GA e GAM/GPT

import { chromium, type Request } from 'playwright';
import c from 'ansi-colors';
import fs from 'fs';
import { taskQueue } from '@lcrespilho/async-task-queue';
import { Site, flatRequestUrl, jsonarray2csv } from './common';
import sitesJson from './sites.json';

const TaskQueue = taskQueue(process.env.CONCURRENCY || 10);

let sites: Site[] = [
  {
    url: 'https://louren.co.in',
    gtms: [],
    ga3Properties: [],
    ga4Properties: [],
    error: '',
    visited: false,
  },
  { url: 'https://mueveloconpepsi.com' },
  { url: 'https://promopepsi.com.ar' },
  { url: 'https://doritos.com.br' },
  { url: 'https://gatorade.com.br' },
  { url: 'https://mabel.com.br' },
  { url: 'https://campoaopacote.lays.com.br' },
  { url: 'https://sumalesabor.com' },
  { url: 'https://tussnacksfavoritos.com' },
  { url: 'https://fritolaypromotion.com' },
  { url: 'https://fritolaysnacks.com.pe' },
  { url: 'https://rankeatedoritos.com' },
  { url: 'https://clipsy.rs' },
  { url: 'https://pepsi.at' },
  { url: 'https://pepsicoicecek.com.tr' },
  { url: 'https://7up.fr' },
  { url: 'https://alvalle.fr' },
  { url: 'https://fruko.com.tr' },
  { url: 'https://lays.hu' },
  { url: 'https://lays.it' },
  { url: 'https://swietujzlaysipepsi.pl' },
  { url: 'https://pepsi.fr' },
  { url: 'https://quaker.fr' },
  { url: 'https://gewinnen-mit-punica.de' },
  { url: 'https://lipton-probier-mich.de' },
  { url: 'https://mountaindew.se' },
  { url: 'https://lays-images.com' },
  { url: 'https://pepsi.si' },
  { url: 'https://pepsimax.it' },
  { url: 'https://simba.co.za' },
  { url: 'https://cms.dothedewsaudi.com' },
  { url: 'https://liquifruit.co.za' },
  { url: 'https://win.redrockdeli.com.au' },
  { url: 'https://summerpromo.pepsimax.com.au' },
  { url: 'https://quaker.com.my' },
  { url: 'https://pepsico.com.pk' },
  { url: 'https://pepsirecycled.com' },
  { url: 'https://marmite.co.za' },
  { url: 'https://moirs.co.za' },
  { url: 'https://khouseofpepsi.com' },
  { url: 'https://dothedewsaudi.com' },
  { url: 'https://pocavietnam.com' },
  { url: 'https://admin-panel.pocavietnam.com' },
  { url: 'https://duetdogry.pl' },
  { url: 'https://ganapremiosconkfcypepsimax.es' },
  { url: 'https://media.pepsico.com' },
  { url: 'https://websitecontrolcenter.pepsico.com' },
  { url: 'https://api.brasil3kmpepsi.com' },
  { url: 'https://api.3kmpepsi.com' },
  { url: 'https://rockstarsummer.com' },
  { url: 'https://smithstasteicons.com.au' },
  { url: 'https://obela.mx' },
  { url: 'https://promocionespepsico.com' },
  { url: 'https://pepsilollacl.com' },
  { url: 'https://pepsicr.com' },
  { url: 'https://salvandolochapin.com' },
  { url: 'https://pepsi.cl' },
  { url: 'https://gssilatam.org' },
  { url: 'https://mialmacenero.cl' },
  { url: 'https://promocionespepsicolatam.com' },
  { url: 'https://actitudverano.cl' },
  { url: 'https://eshoradefutbol.com' },
  { url: 'https://elbotinfritolay.com' },
  { url: 'https://scratchtogreatness.com' },
  { url: 'https://theideatory.com' },
  { url: 'https://pepsicoideatory.com' },
  { url: 'https://sunbites.mx' },
  { url: 'https://querovenderpepsico.com.br' },
  { url: 'https://laysfutbol.com' },
  { url: 'https://tostitos.com.pe' },
  { url: 'https://unlockthesmiles.com' },
  { url: 'https://chesterdrop.com' },
  { url: 'https://pepsigoldengiveaway.com' },
  { url: 'https://be.pepsimovietime.gr' },
  { url: 'https://pepsi.tumblr.com' },
  { url: 'https://gatoradesportsshop.com' },
  { url: 'https://freetheessence.com.br' },
  { url: 'https://doritosticketoffer.com' },
  { url: 'https://liptonicedteaday.com' },
  { url: 'https://gatoradefootball.com' },
  { url: 'https://gatoradeendurance.com' },
  { url: 'https://fuelyourwaytothechampionship.com' },
  { url: 'https://gatoradebigten.com' },
  { url: 'https://sweatearnschampionships.com' },
  { url: 'https://fueltomorrowcfb.gatorade.com' },
  { url: 'https://mtndew.live' },
  { url: 'https://dewventure.com' },
  { url: 'https://starrywalmart.com' },
  { url: 'https://pepsi.brandmovers.co' },
  { url: 'https://gametimewithquaker.com' },
  { url: 'https://cle.mypepsico.com' },
  { url: 'https://pepsisportsentry.com' },
  { url: 'https://innovationhub.mypepsico.com' },
  { url: 'https://pepsipromos.com' },
  { url: 'https://pepsipayzero.com' },
  { url: 'https://drinkbolt24.ca' },
  { url: 'https://gatoradefuelyourgame.com' },
  { url: 'https://upgradeyourstrength.com' },
  { url: 'https://gatorade5v5.com' },
  { url: 'https://preparatecontodo.com' },
  { url: 'https://veranomashot.com' },
  { url: 'https://fritolaypanama.com' },
  { url: 'https://chokis.com.co' },
  { url: 'https://passport.pepsidigin.com' },
  { url: 'https://pepsicojuntoscrecemos.com' },
  { url: 'https://starrynbasweeps.com' },
  { url: 'https://tastytoobs.com.au' },
  { url: 'https://misttwst.com' },
  { url: 'https://calebskola.com' },
  { url: 'https://lemonlemonsparkling.com' },
  { url: 'https://pepsicares.com' },
  { url: 'https://pepsihalftime.com' },
  { url: 'https://giesabreak.scottsporage.com' },
  { url: 'https://kibicujzlays.lays.pl' },
  { url: 'https://cheetos.be' },
  { url: 'https://piperscrispsexport.com' },
  { url: 'https://menu.pepsimax-lays.com' },
  { url: 'https://pepsimax-lays.com' },
  { url: 'https://copellafruitjuices.co.uk' },
  { url: 'https://cruesli.be' },
  { url: 'https://cruesli.nl' },
  { url: 'https://konkurscheetos.pl' },
  { url: 'https://nakedjuice.fr' },
  { url: 'https://nobbys.co.uk' },
  { url: 'https://pepsi.se' },
  { url: 'https://pepsifootball.com.mt' },
  { url: 'https://tasteusloveus.com' },
  { url: 'https://tostitos.co.uk' },
  { url: 'https://tropicanajuice.dk' },
  { url: 'https://veranopepsimax.com' },
  { url: 'https://walkers-snacks.co.uk' },
  { url: 'https://cheetos.nl' },
  { url: 'https://filmyzlays.lays.pl' },
  { url: 'https://kibicepepsi.pl' },
  { url: 'https://konkursurodzinowy.pl' },
  { url: 'https://navidadpepsimax.com' },
  { url: 'https://promocjastar.pl' },
  { url: 'https://punica-images.com' },
  { url: 'https://scottsporage.com' },
  { url: 'https://wakacyjnenagrody.pl' },
  { url: 'https://zabawazcheetos.pl' },
  { url: 'https://konkurspepsi.pl' },
  { url: 'https://latozlipton.pl' },
  { url: 'https://letnialoteria.pepsi.pl' },
  { url: 'https://letnieduety.pl' },
  { url: 'https://lipton-images.com' },
  { url: 'https://pepsi-images.com' },
  { url: 'https://rockstar-images.com' },
  { url: 'https://cheerforourhour.com' },
  { url: 'https://meanwhileinthepepsi-verse.com' },
  { url: 'https://quaker.com.hk' },
  { url: 'https://freethebirdnz.com' },
  { url: 'https://tostitos.co.nz' },
  { url: 'https://latozlays.pl' },
  { url: 'https://konkursnawakacje.pl' },
  { url: 'https://pepsi-max-tastechallenge-app.com' },
  { url: 'https://pepsifootball.com' },
  { url: 'https://theblackartrising.com' },
  { url: 'https://darrnudaraa.mountaindew.in' },
  { url: 'https://pepsico.lat' },
  { url: 'https://quaker.cl' },
  { url: 'https://raices.cl' },
  { url: 'https://loteriapilkarska.pepsi.pl' },
  { url: 'https://konkursfilmowy.pepsi.pl' },
  { url: 'https://layssverige.se' },
  { url: 'https://cytosport.com' },
  { url: 'https://monstermilk.com' },
  { url: 'https://getoutsidewithevolve.com' },
  { url: 'https://account.pepsico.com' },
  { url: 'https://greenlabelexclusives.com' },
  { url: 'https://pepsicomomentstosave.com' },
  { url: 'https://playultimatematchup.com' },
  { url: 'https://pepsirocksnow.com' },
  { url: 'https://dietpepsi.com' },
  { url: 'https://fbfoodservice.pepsi.com' },
  { url: 'https://gamedayofficial.com' },
  { url: 'https://pepsianthems.com' },
  { url: 'https://hypedforhalftime.com' },
  { url: 'https://kickstart.mountaindew.com' },
  { url: 'https://green-label.com' },
  { url: 'https://pepsichallenge.com' },
  { url: 'https://sitios.univision.com' },
  { url: 'https://sobeunderthecap.com' },
  { url: 'https://projectcobalt.com' },
  { url: 'https://bemoreteafestival.com' },
  { url: 'https://doubleshotpromo.com' },
  { url: 'https://pepsportsrewards.com' },
  { url: 'https://shop.pepsi.com' },
  { url: 'https://savorthesunrise.com' },
  { url: 'https://therecipe.pepsi.com' },
  { url: 'https://pepsiupforgrabs.com' },
  { url: 'https://hoistthecup.pepsi.ca' },
  { url: 'https://oneupyourhydration.com' },
  { url: 'https://marketingmavenawards.pepsico.com' },
  { url: 'https://pepsifunsweepstakes.com' },
  { url: 'https://pepsiandtostitos.com' },
  { url: 'https://pepsipopupshop.com' },
  { url: 'https://uncledrew.com' },
  { url: 'https://dgrewards.com' },
  { url: 'https://mtndewhoops.com' },
  { url: 'https://pepsifiresweepstakes.com' },
  { url: 'https://pepsisummerprizesweeps.com' },
  { url: 'https://pepsipicksix.com' },
  { url: 'https://nakedjuice.ca' },
  { url: 'https://sgquakerchef.com' },
  { url: 'https://dewanddoritos.ca' },
  { url: 'https://dalecall.mountaindew.com' },
  { url: 'https://mtndewapp.com' },
  { url: 'https://mountaindewtakeitoutside.com' },
  { url: 'https://mtndewrewards.com' },
  { url: 'https://dewinstantscore.com' },
  { url: 'https://dewnationrewards.com' },
  { url: 'https://closerthancourtside.mountaindew.com' },
  { url: 'https://dewnited.com' },
  { url: 'https://mtndewtr.com' },
  { url: 'https://dewoutdoors.com' },
  { url: 'https://hyveedewoutdoor.com' },
  { url: 'https://lifechangingdew.com' },
  { url: 'https://dewoutdoorguides.com' },
  { url: 'https://dewoutdoorgrants.com' },
  { url: 'https://kumandplaymajormelon.com' },
  { url: 'https://circlekcallofduty.com' },
  { url: 'https://dewreptheland.com' },
  { url: 'https://mountaindewflavorslam.com' },
  { url: 'https://ledodewflavorslam.com' },
  { url: 'https://treasuresofbajaisland.com' },
  { url: 'https://greattastezerosugar.ca' },
  { url: 'https://excellentgoutzerosucre.ca' },
  { url: 'https://dewxpapajohns.com' },
  { url: 'https://littlecaesarscallofduty.ca' },
  { url: 'https://mtndewnba2k23.com' },
  { url: 'https://readysetsummersweeps.com' },
  { url: 'https://icipepsi.ca' },
  { url: 'https://bwwpepsifantasydraft.com' },
  { url: 'https://pepsiiheartkangaroo.com' },
  { url: 'https://pepsiiheartquiktrip.com' },
  { url: 'https://pepsiiheart.com' },
  { url: 'https://foodliondewshop.com' },
  { url: 'https://dewsummergrilling.com' },
  { url: 'https://pepsipatriots.com' },
  { url: 'https://pepsihalftimetrip.com' },
  { url: 'https://dewtasteofthemountain.com' },
  { url: 'https://thedewgeneralstore.com' },
  { url: 'https://pepsicmafest.com' },
  { url: 'https://dewmarchsweeps.com' },
  { url: 'https://pepsimaxhouse.com' },
  { url: 'https://snacksharesave.com' },
  { url: 'https://pepsitastechallenge.com' },
  { url: 'https://pjpizzapepsirocks.com' },
  { url: 'https://pepsicoafh2015.com' },
  { url: 'https://drinkaloha.com' },
  { url: 'https://pepsistrikegold.com' },
  { url: 'https://squad.mountaindew.com' },
  { url: 'https://pepsi50tix.com' },
  { url: 'https://pepsi50ksweeps.com' },
  { url: 'https://dewchampionships.com' },
  { url: 'https://pepsidoritoscodes.com' },
  { url: 'https://pepsisummerfun.com' },
  { url: 'https://pepsicoculinarystudio.com' },
  { url: 'https://premierethefun.com' },
  { url: 'https://mtndewstop.com' },
  { url: 'https://pepsiwonderlandatdg.com' },
  { url: 'https://lcpepsisweeps.com' },
  { url: 'https://pepsiwalmartsweepstakes.com' },
  { url: 'https://pepsirockthisway.com' },
  { url: 'https://pepsitunes.com' },
  { url: 'https://pepsiallstar.com' },
  { url: 'https://pepsisodexofootballfan.com' },
  { url: 'https://mtndewski.com' },
  { url: 'https://pepsitakeittothehouse.com' },
  { url: 'https://dewthe99.com' },
  { url: 'https://pureleafsweeps.com' },
  { url: 'https://sodexobublyss.com' },
  { url: 'https://pepsiplaylist.com' },
  { url: 'https://bandsandbiscuits.com' },
  { url: 'https://mountaindewportal.com' },
  { url: 'https://halftimeshowsweeps.com' },
  { url: 'https://bublymatchgame.com' },
  { url: 'https://pepsifreeze.com' },
  { url: 'https://madeforfootballwatching.com' },
  { url: 'https://dolejuice.com' },
  { url: 'https://flaminhot.com' },
  { url: 'https://pepsisuperbowl.com' },
  { url: 'https://pepsirandysdonuts.com' },
  { url: 'https://izzeguarantee.com' },
  { url: 'https://stackyourwins.musclemilk.com' },
  { url: 'https://pepsistuff.ca' },
  { url: 'https://pepsiroyals50.com' },
  { url: 'https://summerofpepsi.com' },
  { url: 'https://gatoradegear.ca' },
  { url: 'https://pepsisummer.com' },
  { url: 'https://crunch-bowl.com' },
  { url: 'https://giftwithpepsi.com' },
  { url: 'https://dewoutpost.com' },
  { url: 'https://spotthebuble.com' },
  { url: 'https://rushintowin.com' },
  { url: 'https://yearofdew.com' },
  { url: 'https://pepsisummergram.com' },
  { url: 'https://unstoppablepride.com' },
  { url: 'https://doritoslegionofthebold.com' },
  { url: 'https://pepsiplays.com' },
  { url: 'https://bublyholidaycheer.com' },
  { url: 'https://gearupforgameday.com' },
  { url: 'https://briskzerodrop.com' },
  { url: 'https://dewstockupsweeps.com' },
  { url: 'https://bublyholidaysweaters.com' },
  { url: 'https://pepsihalftimeshow.com' },
  { url: 'https://fullofdetroitsoul.com' },
  { url: 'https://rockstarrockon.com' },
  { url: 'https://drinkfrutly.com' },
  { url: 'https://neonzebramixers.com' },
  { url: 'https://moresmileswitheverysip.com' },
  { url: 'https://rockstarrisegame.com' },
  { url: 'https://pepsipassport.com' },
  { url: 'https://pepsiitsanewyorkthing.com' },
  { url: 'https://propelsweeps.com' },
  { url: 'https://pepsivista.com' },
  { url: 'https://madeforbengalswatching.com' },
  { url: 'https://madeforbillswatching.com' },
  { url: 'https://madeforcowboyswatching.com' },
  { url: 'https://madefordolphinswatching.com' },
  { url: 'https://madeforeagleswatching.com' },
  { url: 'https://madeforgiantswatching.com' },
  { url: 'https://madeforjaguarswatching.com' },
  { url: 'https://madeforjetswatching.com' },
  { url: 'https://madeforlionswatching.com' },
  { url: 'https://madeforpatriotswatching.com' },
  { url: 'https://madeforsteelerswatching.com' },
  { url: 'https://madeforvikingswatching.com' },
  { url: 'https://madeforwashingtonfootballwatching.com' },
  { url: 'https://rockstarenergycountry.com' },
  { url: 'https://driveforpepsi.com' },
  { url: 'https://sipnowsavelater.com' },
  { url: 'https://liveunmuddled.com' },
  { url: 'https://iam.fullofdetroitsoul.com' },
  { url: 'https://pepsisodashop.com' },
  { url: 'https://pepsisipsnacktoss.com' },
  { url: 'https://challenge.pepsicorecycling.com' },
  { url: 'https://turnupyourmood.com' },
  { url: 'https://vamosfootball2022.com' },
  { url: 'https://liptoninstantwin.com' },
  { url: 'https://winpepsipopstar.com' },
  { url: 'https://tropicanacrunch.com' },
  { url: 'https://bayasweeps.com' },
  { url: 'https://nitropepsiwalmart.com' },
  { url: 'https://lifewtr100days.com' },
  { url: 'https://givebackjamon.com' },
  { url: 'https://musclemilkliftingproject.com' },
  { url: 'https://rockstarprizes.ca' },
  { url: 'https://prixrockstar.ca' },
  { url: 'https://pepsinyc.com' },
  { url: 'https://rockstarbelieveit.com' },
  { url: 'https://biggestpartyinthesouth.com' },
  { url: 'https://bublywfhawaii.com' },
  { url: 'https://rockstarenergysportvehicle.com' },
  { url: 'https://starbucksbayaenergysweeps.com' },
  { url: 'https://pzsproexperience.com' },
  { url: 'https://liptonfootballsweeps.com' },
  { url: 'https://thedewzonesweeps.com' },
  { url: 'https://samsclubcafe.chipsnsips.com' },
  { url: 'https://pepsisummergiveaway.com' },
  { url: 'https://winsummer.ca' },
  { url: 'https://pepsigamedaypromo.com' },
  { url: 'https://bayaelectricbikesweeps.com' },
  { url: 'https://pepsitailgate.com' },
  { url: 'https://rockstarenergyxbox.ca' },
  { url: 'https://rockstarenergisantexbox.ca' },
  { url: 'https://wawaeaglessweeps.com' },
  { url: 'https://stackyoursleigh.ca' },
  { url: 'https://remplissezvotretraineau.ca' },
  { url: 'https://pepsigamedaycookoff.com' },
  { url: 'https://lucky.com.br' },
  { url: 'https://toddy.com.br' },
  { url: 'https://snacks.cl' },
  { url: 'https://pepsicochangecompass.com' },
  { url: 'https://pepbridge.pepsicodigital.com' },
  { url: 'https://events.pepsico.com' },
  { url: 'https://pepsicouxcoe.com' },
  { url: 'https://consumer2030pepsislider.com' },
  { url: 'https://climatesimulator.pepsico.com' },
  { url: 'https://toddy.cl' },
  { url: 'https://cheetos.mx' },
  { url: 'https://chestercheetos.com.mx' },
  { url: 'https://chestercheetos.mx' },
  { url: 'https://chewy.mx' },
  { url: 'https://churrumais.com.mx' },
  { url: 'https://churrumais.mx' },
  { url: 'https://crackets.com' },
  { url: 'https://crackets.mx' },
  { url: 'https://crujitos.mx' },
  { url: 'https://fritos.mx' },
  { url: 'https://habaneras.mx' },
  { url: 'https://hummus.mx' },
  { url: 'https://kacang.mx' },
  { url: 'https://mamutmamut.com' },
  { url: 'https://mancha-t.mx' },
  { url: 'https://manchat.com.mx' },
  { url: 'https://manchat.mx' },
  { url: 'https://marias.com.mx' },
  { url: 'https://mariasgamesa.com.mx' },
  { url: 'https://mariasgamesa.mx' },
  { url: 'https://milch.com.mx' },
  { url: 'https://milch.mx' },
  { url: 'https://obelamex.com.mx' },
  { url: 'https://obelamexico.com.mx' },
  { url: 'https://paketaxo.mx' },
  { url: 'https://papassabritas.mx' },
  { url: 'https://poffets.mx' },
  { url: 'https://ruffles.mx' },
  { url: 'https://sabritas.mx' },
  { url: 'https://saladitas.mx' },
  { url: 'https://tostitos.mx' },
  { url: 'https://churrumais.com' },
  { url: 'https://crujitos.com' },
  { url: 'https://emperador.mx' },
  { url: 'https://emperadorgamesa.com' },
  { url: 'https://gamesaclasicas.com' },
  { url: 'https://kkwates.com' },
  { url: 'https://paketaxo.com' },
  { url: 'https://papassabritas.com' },
  { url: 'https://rancheritos.com' },
  { url: 'https://chestercheetos.com' },
  { url: 'https://hazloconquaker.com' },
  { url: 'https://cheetos.cl' },
  { url: 'https://lays.com.br' },
  { url: 'https://ruffles.com.br' },
  { url: 'https://rancheritos.mx' },
  { url: 'https://doritos.cl' },
  { url: 'https://retrosnacks.cl' },
  { url: 'https://lays.cl' },
  { url: 'https://gatorade.cl' },
  { url: 'https://chester.cl' },
  { url: 'https://chispop.cl' },
  { url: 'https://fritolay.cl' },
  { url: 'https://nachos.cl' },
  { url: 'https://ramitas.cl' },
  { url: 'https://snack.cl' },
  { url: 'https://gatoraderunning.lat' },
  { url: 'https://campanhatoptime.com.br' },
  { url: 'https://stax.cl' },
  { url: 'https://participedoplanetlove.com' },
  { url: 'https://briskmode.com' },
  { url: 'https://poppables.com' },
  { url: 'https://drinkfinity.co.de' },
  { url: 'https://gatorade.tumblr.com' },
  { url: 'https://gatoradehat.com' },
  { url: 'https://apps.facebook.com' },
  { url: 'https://culversyellowstone.com' },
  { url: 'https://culverspuzzleadventure.com' },
  { url: 'https://culversadventure.com' },
  { url: 'https://culversholidaysweeps.com' },
  { url: 'https://dewnitedwalmart.com' },
  { url: 'https://pepsibaseball.com' },
  { url: 'https://chooseyourheat.com' },
  { url: 'https://pepfeed.mypepsico.com' },
  { url: 'https://cookwithquaker.com' },
  { url: 'https://rockstarextramilesweeps.com' },
  { url: 'https://pepsibaseballsweeps.com' },
  { url: 'https://oatauthority.tumblr.com' },
  { url: 'https://lays.fr' },
  { url: 'https://pepsico-pro.fr' },
  { url: 'https://recettes.quaker.fr' },
  { url: 'https://pepsico-foodservice.fr' },
  { url: 'https://quakerarabia.com' },
  { url: 'https://spekkorice.co.za' },
  { url: 'https://sasko.co.za' },
  { url: 'https://flavorsplash.com' },
  { url: 'https://weareblood.com' },
  { url: 'https://yachak.com' },
  { url: 'https://elmachips.com.br' },
  { url: 'https://pastagrande.co.za' },
  { url: 'https://winkler-jewelry.com' },
  { url: 'https://maizoro.com.mx' },
  { url: 'https://pepsicoschoolsource.com' },
  { url: 'https://musclemilk.com' },
  { url: 'https://piperscrisps.com' },
  { url: 'https://fritolay.com.tr' },
  { url: 'https://conquista-bares.com' },
  { url: 'https://gatorade.at' },
  { url: 'https://pepsiconcorsi.it' },
  { url: 'https://pidepepsimax.es' },
  { url: 'https://meconsumerfeedback.com' },
  { url: 'https://smiths-chips.com.au' },
  { url: 'https://pepsi.in' },
  { url: 'https://pioneerfoods.co.za' },
  { url: 'https://pepsicotaiwan.com' },
  { url: 'https://brasil3kmpepsi.com' },
  { url: 'https://waterdispenserstandard.com' },
  { url: 'https://funyuns.com' },
  { url: 'https://moresmileswitheverybite.com' },
  { url: 'https://fritolayemployment.com' },
  { url: 'https://quaker.co.id' },
  { url: 'https://popcorners.com.au' },
  { url: 'https://pepsico.cl' },
  { url: 'https://fritolayhoops.com' },
  { url: 'https://wheeloflevy.com' },
  { url: 'https://drinkfinity.com.br' },
  { url: 'https://pepsicoteamofchampions.com' },
  { url: 'https://foundedbyher.org' },
  { url: 'https://dolelemonade.com' },
  { url: 'https://popcorners.com' },
  { url: 'https://pepsico.co.uk' },
  { url: 'https://chewy.com.mx' },
  { url: 'https://kkwates.com.mx' },
  { url: 'https://mamutmamut.com.mx' },
  { url: 'https://mancha-t.com.mx' },
  { url: 'https://quaker.mx' },
  { url: 'https://rockaleta.mx' },
  { url: 'https://ceresfruitjuice.com' },
  { url: 'https://gatorade.com.co' },
  { url: 'https://fundacionsabritas.org.mx' },
  { url: 'https://portalproveedorespepsico.com' },
  { url: 'https://participaconpepsico.com' },
  { url: 'https://pepsiinteractivevending.com' },
  { url: 'https://drinkfinity.co.uk' },
  { url: 'https://earnfootballgear.com' },
  { url: 'https://doritosspiderman.com' },
  { url: 'https://dummy.com' },
  { url: 'https://pepsihootersweeps.com' },
  { url: 'https://toysfortots.org' },
  { url: 'https://sodastream.com.br' },
  { url: 'https://drinkstation.com' },
  { url: 'https://secretsantapromo.com.au' },
  { url: 'https://packsnackwin.com.au' },
  { url: 'https://7up.com' },
  { url: 'https://youtube.com' },
];

// Continua de onde parou.
if (JSON.stringify(sitesJson) !== '[]') sites = sitesJson as Site[];

(async () => {
  const browser = await chromium.launch({
    //args: ['--start-maximized'],
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS === 'true',
  });

  const context = await browser.newContext({
    viewport: {
      width: 1700,
      height: 900,
    },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    storageState: 'state.json',
  });

  context.setDefaultTimeout(60000);

  await Promise.all(
    sites
      .filter(site => !site.visited)
      .slice(0, 30)
      .map(site =>
        TaskQueue.push(async done => {
          try {
            console.log(c.blue(site.url));
            const page = await context.newPage();

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
                  site.gtms = site.gtms || [];
                  if (!site.gtms.includes(gtm)) {
                    site.gtms.push(gtm);
                  }
                }

                // Detecção das propriedades de GA3
                else if (/^https:\/\/(www\.google-analytics|analytics\.google\.com).*collect\?v=1/.test(flatUrl)) {
                  const tid = new URL(flatUrl).searchParams.get('tid')!;
                  if (!tid.startsWith('UA-')) return;
                  site.ga3Properties = site.ga3Properties || [];
                  if (!site.ga3Properties.includes(tid)) {
                    site.ga3Properties.push(tid);
                  }
                }

                // Detecção das propriedades de GA4
                else if (/^https:\/\/(www\.google-analytics|analytics\.google\.com).*collect\?v=2/.test(flatUrl)) {
                  const tid = new URL(flatUrl).searchParams.get('tid')!;
                  if (!tid.startsWith('G-')) return;
                  site.ga4Properties = site.ga4Properties || [];
                  if (!site.ga4Properties.includes(tid)) {
                    site.ga4Properties.push(tid);
                  }
                }
              } catch (e) {
                console.error('ERRO page.on("request") ' + site.url + ' ', e);
                site.error += ' ERRO page.on("request") ';
                site.visited = true;
              }
            });

            await page.waitForTimeout(1000); // tempo para abertura do DevTools

            // Realiza a navegação no site. Basicamente, carrega o site e aguarda um tempo bom
            // para disparar analytics (GTM e GA). Depois procura por GAM GPT Ad Units na LP.
            await page
              .goto(site.url, { waitUntil: 'domcontentloaded' })
              .then(async () => {
                // tempo para clicar em banners de cookie, etc
                await page.waitForTimeout(10000);

                // Simula interação para forçar o carregamento de analytics em sites lazy.
                await page.mouse.move(100, 100, { steps: 3 });
                await page.hover('body', { position: { x: 200, y: 150 }, timeout: 4000 }).catch(() => {});
                await page.waitForLoadState('load');
                await page.evaluate(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                  });
                });
                // para sites que disparam pageview depois do evento load.
                await page.waitForTimeout(5000);
                await page.evaluate(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                });
                // Para sites ainda mais lentos e mais "lazy".
                await page.waitForTimeout(5000);
                site.visited = true;
              })
              .catch(error => {
                site.error = (error.message.split('\n')[0]).replace(/\\n/g, '_');
                site.visited = true;
                console.log(c.red('Error:'), error.message);
              });

            await page.waitForTimeout(1000);
            await page.close();
          } catch (e) {
            console.error('validar manualmente ' + site.url + ' ', e);
            site.error += ' validar manualmente ';
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
