# cdct
crop damage capture tool
DATABASE PLAN----


//FOR MUNICIPAL OR BRGY LEVEL REPORT
-1ST COLUMN(CITY / BRGY) - LIST OF BARANGAY OR MUNI
-2ND COL(ECOSYSTEM)RICE - DISTINCT ECO
-2ND COL (TOPOGRAPHY/VARIETY)CORN - TOPO + VARIETY 
-2ND COL(ECOSYSTEM)RICE-ECOSYSTEM
-3RD COL (STAGE)-RICE OR CORN STAGE
-4TH COL (# OF FARMERS AFFECTED) - TOTAL FARMER AFFECTED PER BGY/MUNI, PER ECOSYSTEM/VARIETY
-5TH COL (AREA OF STANDING CROP) - TOTAL AREA OF FARM PER BRGY/MUNI,PER ECOSYSTEM/VARIETY

--------------PER BGY/MUNI, ECOSYSTEM/VARIETY, STAGE------------------
-6TH COL (AREA AFFECTED-TOTALLY DAMAGE(HA)) -
COMPUTATION:INPUT FROM DATA

-7TH COL (AREA AFFECTED-PARTIALLY DAMAGE (HA))-
COMPUTATION:INPUT FROM DATA

-8TH COL (TOTAL AREA AFFECTED (HA))-
COMPUTATION:PARTIALLY TOTAL OR TOTALLY TOTAL

YIELD BEFORE CALAMITY(HA/MT)-
COMPUTATION:INPUT FROM DATA

YIELD AFTER CALAMITY(HA/MT)-
COMPUTATION:INPUT FROM DATA

YIELD LOSS(%)-
COMPUTATION:YBC - YAC / YBC * 100

---------------------------------------------------------------------------------------------------
COST OF PRODUCTION/HA:
NOTES: PUT COST OF PORDUCTION IN SETTINGS AND AUTOMATIC LOAD IN GROUP DATA
INPUTS:
	//IF SEEDLING THE PROD COST IS BAG OF SEEDS
	IF CTYPE = RICE AND ECOSYSTEM = INBRED
		IF STAGE=SEEDLING  AND SEED CLASS = CERTIFIED
			PROD COST VAL = 3560
		IF STAGE=SEEDLING  AND SEED CLASS = REGISTERED SEED
			PROD COST VAL = 3900
		IF STAGE=SEEDLING  AND SEED CLASS = GOOD SEED
			PROD COST VAL = 3100
		IF STAGE =NEWLY PLANTED AND SEED CLASS = CERTIFIED SEED || REGISTERED SEED || GOOD SEED
			PROD COST VALUE = 25132
		IF STAGE =VEGETATIVE AND SEED CLASS = CERTIFIED SEED || REGISTERED SEED || GOOD SEED
			PROD COST VALUE = 28736
		IF ECOSYSTEM = HYBRID
		SEEDLING = 7500
		NEWLY PLANTED = 29112
		VEGETATIVE = 32716

	IF CTYPE = CORN 
		CASE NEWLY PLANTED
			VARIETY = FLINT || GLUTINOUS
			PROD VALUE = 23530
			VARIETY = SWEET CORN
			PROD VALUE = 33730
		CASE VEGETATIVE
			VARIETY = FLINT || GLUTINOUS
			PROD VALUE = 35630
			VARIETY = SWEET CORN
			PROD VALUE = 45830
		CASE NEWLY PLANET
			VARIETY = BT/GT
			PROD VALUE = 34330
		CASE VEGETATIVE
			VARIETY = BTGT
			PROD VALUE = 46430

--------------------------------------------------------------------------------------------------------
VALUE OF PRODUCTION LOSSES (FOR SEEDLING AND VEGETATIVE PHASE)
COMPUTATION:
	COST OF PROD PER HECTARE * TOTAL AREA AFFECTED * % YIELD LOSS
----------------------------------------------------------------------------------------------------------
FARMGATE VOLUME OF LOSSES (MT)

BEFORE CALAMITY - AFTER CALAMITY
--------------------------------------------------------------------------------------------------------
PRICE PER KG
INPUT : PUT IN SETTINGS
----------------------------------------------------------------------------------------------------------
TOTAL VALUE OF LOSSES
VOLUME OF LOSSES(MT) * 1000 * PRICE *TOTAL AREA AFFECTED
------------------------------------------------------------------------------
DATABASE NAMES

provname,munname,bgyname,farmloc,ownername,farmarea,farmername,ctype,ecosystem,sclass,stage,yieldbefore,yieldafter,partially,totally,remarks

-------------------------------------------------------------------------------
select munname as 'Municipality Name',bgyname as 'Barangay Name',ecosystem,stage,count(farmername) as 'No. of Farmers Affected' ,sum(farmarea) as 'Farm Area',sum(totally) as 'totally damaged',sum(partially) as 'partially damage',
sum(partially+totally)as 'total area affected', sum(yieldbefore) as 'Yield before Calamity', sum(yieldafter) as 'yield after calamity',round(((yieldbefore-yieldafter)/yieldbefore)*100,2)  as 'yield loss', 
(case when stage like '%Seedling%' or stage like '%Tillering%' then 21185 else '' end) as 'volume',
(case when stage like '%seedling%' then sum(20*21185/farmarea)else '' end)as 'production value',
 (case when stage not like '%Seedling%' and totally !=0 then round(21185*(totally)* ((yieldbefore-yieldafter)/yieldbefore)*100,2)
 else '' end)as 'totally value',
(case when stage not like '%Seedling%' and partially !=0 then round(21185*(partially)* ((yieldbefore-yieldafter)/yieldbefore)*100,2)
 else '' end)as 'partially value'
 
from CropDamage where ctype like '%corn%' group by bgyname,ecosystem,stage order by ecosystem asc

--------------------------------------
(case when stage like '%Seedling%' or stage like '%Tillering%' then 21185 else '' end) as 'volume'


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
###NOTES###

CORN STAGE --done
-VEGETATIVE PHASE
EMERGENCE
FIRST LEAF COLLAR
SECOND LEAF COLLAR
THIRD LEAF COLLAR
'NTH LEAF COLLAR
TASSELING

-REPRODUCTIVE
SILKING
BLISTER
MILK
DOUGH
DENT
MATURITY

##CORN TOPOGRAPHY / ECOSYSTEM --done
1.UPLAND
2. LOWLAND


##CORN VARIETIES / SEED CLASS
1.TRANSGENIC CORN
	-BT CORN
	-GT CORN
2. HYBRID
3.OPEN POLLINATED VARIETY
	-FLINT
	-GLUTINOUS
	-SWEET CORN

##SEED CLASS / ADDITIONAL DROP DOWN
-.REGISTERED
-CERTIFIED
-GOOD


###RICE STAGE## --done
	-VEGETATIVE PHASE
	1. SEEDLONG
	2. TILLERING
	3. STEM ELONGATION
	-REPRODUCTIVE PHASE
	1. BOOTING
	2. HEADING
	3. FLOWERING
	-MATURITY
	1. MILKING
	2. DOUGH
	3. RIPENING

##OTHER NOTES###

-CHANGE YIELD PER HA. INPUT (KLS INSTED OF MT) - IN MOBILE
-FOR GRAPH AND PLOT DATA
	1.YIELD LOSS
	2.NUMBER OF FARMERS AFFECTED
	3.TOTAL AREA AFFECTED

-BASE ON 
	1. PER BARANGAY
	2. PER YEAR
	3. PER SEASON
	4. PER CROP TYPE

ADD DROPDOWN IN PC BASE
PER REPORT TYPE
	1.INITIAL - 2-3 DAYS DURING CALAMITY
	2.PROGRESS - DURING CALAMITY
	3.FINAL - ASSESSED BY DA.PER FARMER DIN ANG DATA

-######INPUTS FROM SETTING ####
---
1.calamityid
2.calamityname
1.COST OF PROD PER HA(BASE ON MANUAL)
2.WIND SPEED
3. REPORT TYPE
4.PRICE PER KL.
5.SEASON
7. DATE START
8. DATE END
9.PREPARED BY: ADMIN
10. REVIEWED BY: ADMIN
11. 

----------------------------------------------
FARMERS DATA - farmer table(also from cropdamage table)
(db field)
NO.AUTO INCREMENT
farmer id:
calamityid:
calamityname:
season:
year:
province:
municipality:
barangay:
farmername:
ecosystem
totally
partially

computed field()
total damaged for totally(total per ecosystem)
total damaged for partially(total per ecosystem)
total area affected



-----------------------------------------------
create gant chart

feb - data gathering and validation
march - create methodology
april - database schema creation
may - august - created the mobile app
june - september - created the pc base app
