<script setup>
import { ref, computed } from 'vue'

const items = ref([
  {
    "journalID": 20087,
    "planningID": "5cbe00bd-2ab2-4990-b6a0-52c1763153cf",
    "batchID": "02467333-5b51-46f7-b35f-a96d11189157",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-03T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "450926100561",
    "product1Name": "F-190  LORRY  1st-org1",
    "product1InBomName": "F-190  LORRY  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 2,
    "product2SelectedCode": "4509261005831250",
    "product2Name": "F-190 (1250KG)  IBC  1st-org1",
    "product2InBomName": "F-190  LORRY  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": 1250.00,
    "product2UomCount": 45,
    "lotNumber": "PA24122413",
    "producingDate": "2024-12-03T00:00:00",
    "finishedDate": "2024-12-03T00:00:00",
    "remark": "ใส่เพื่อจะได้ submit ไปเช็ค มัน ไม่ควร validate ตรงนี้",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-03T17:10:22.703",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20091,
    "planningID": "84dbfed8-aef6-4a5a-8930-40ec365b4f94",
    "batchID": "c183180c-624d-4625-a827-52d2d1eaf52a",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-03T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "450171201753200",
    "productionName": "CHEMICLEAN PR-029 D/M  Clean",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "450171201753200",
    "product1Name": "CHEMICLEAN PR-029 D/M  Clean",
    "product1InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product1SelectedPackagingCode": "494605910",
    "product1PackagingName": "PL D/M (9.4) 1st-Org-1(EURO)",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122413",
    "producingDate": "2024-12-03T00:00:00",
    "finishedDate": "2024-12-05T00:00:00",
    "remark": "remark 0012",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-06T11:09:37.237",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20095,
    "planningID": "28063435-6d95-4fd2-b52a-2bf2fa1b6273",
    "batchID": "02467333-5b51-46f7-b35f-a96d11189157",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-03T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "450171201753200",
    "productionName": "CHEMICLEAN PR-029 D/M  Clean",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "450171201753200",
    "product1Name": "CHEMICLEAN PR-029 D/M  Clean",
    "product1InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product1SelectedPackagingCode": "494605910",
    "product1PackagingName": "PL D/M (9.4) 1st-Org-1(EURO)",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122414",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": null,
    "remark": "ต้องไมเว้นช่องเอาไว้ให้เราใส่ Remark แน่ๆๆ เลย ลอง คีย์ดูว่าจะเกิดอะไรขึ้น ",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-03T17:11:03.953",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20096,
    "planningID": "45ced417-60da-466b-8cea-bca06badd5da",
    "batchID": "02467333-5b51-46f7-b35f-a96d11189157",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-03T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-321",
    "productionCode": "451640101753170",
    "productionName": "CATION PG-50  D/M  1st-org1",
    "quantityKgs": 6111.00,
    "product1SelectedCode": "451640101753170",
    "product1Name": "CATION PG-50  D/M  1st-org1",
    "product1InBomName": "CATION PG-50  D/M  1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 2,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CATION PG-50  D/M  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": 45,
    "lotNumber": "PA24122428",
    "producingDate": "2024-12-03T00:00:00",
    "finishedDate": "2024-12-05T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T14:15:29.247",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20101,
    "planningID": "b3f507f1-30aa-44a0-b5d6-e2749de12c37",
    "batchID": "eecb1e12-aa87-413e-82cd-c8407fa21126",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451008201583800",
    "productionName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "quantityKgs": 3800.00,
    "product1SelectedCode": "451008201583800",
    "product1Name": "OIL-AR (800 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 800.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122414",
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": "2024-12-06T00:00:00",
    "remark": "test3",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T09:32:02.963",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20103,
    "planningID": "e7e5f17d-f2ce-4881-91ad-72a47eb5e53a",
    "batchID": "7a3fa783-103e-43ef-9637-1849790e4688",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-321",
    "productionCode": "451640101753170",
    "productionName": "CATION PG-50  D/M  1st-org1",
    "quantityKgs": 6111.00,
    "product1SelectedCode": "451640101753170",
    "product1Name": "CATION PG-50  D/M  1st-org1",
    "product1InBomName": "CATION PG-50  D/M  1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 100,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CATION PG-50  D/M  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122430",
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": "2024-12-08T00:00:00",
    "remark": "",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T13:52:28.15",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20105,
    "planningID": "731a3be0-ff1b-4f69-a77b-4a7bad703297",
    "batchID": "eecb1e12-aa87-413e-82cd-c8407fa21126",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "451789102553200",
    "productionName": "AL-40  D/M  1st-org1 DO",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "451789102553200",
    "product1Name": "AL-40  D/M  1st-org1 DO",
    "product1InBomName": "AL-40  D/M  1st-org1 DO",
    "product1SelectedPackagingCode": "494604320",
    "product1PackagingName": "PL D/M small cap PackDelta Clean room",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "AL-40  D/M  1st-org1 DO",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122415",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": "2024-12-05T00:00:00",
    "remark": "test1",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T14:14:41.777",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20106,
    "planningID": "a426e2a7-3acb-4ce2-a0f9-6181f4a27f8c",
    "batchID": "eecb1e12-aa87-413e-82cd-c8407fa21126",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "450171201753200",
    "productionName": "CHEMICLEAN PR-029 D/M  Clean",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "450171201753200",
    "product1Name": "CHEMICLEAN PR-029 D/M  Clean",
    "product1InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product1SelectedPackagingCode": "494605425",
    "product1PackagingName": "20L CLEAN GALLON",
    "product1PackingQtyKgs": 20.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CHEMICLEAN PR-029 D/M  Clean",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122416",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": "2024-12-06T00:00:00",
    "remark": "test2",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH Apv1",
    "updatedDate": "2024-12-04T17:23:25.407",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20108,
    "planningID": "4b0ae4ce-41e2-47b6-bd1c-54ad596b400b",
    "batchID": "eecb1e12-aa87-413e-82cd-c8407fa21126",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451008201583800",
    "productionName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "quantityKgs": 3800.00,
    "product1SelectedCode": "451008201583800",
    "product1Name": "OIL-AR (800 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 800.00,
    "product1UomCount": 4,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122415",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T14:15:15.837",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20109,
    "planningID": "104255af-16df-440e-b298-07704ebd56e3",
    "batchID": "42ca7a4b-3f20-461b-a91c-d1ee8738d41b",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "451506101753180",
    "productionName": " OSMORIN DA-50 (180kg) D/M 1st-org1",
    "quantityKgs": 5943.00,
    "product1SelectedCode": "451506101753180",
    "product1Name": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product1InBomName": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 180.00,
    "product1UomCount": 20,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122415",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": "2024-12-06T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T14:25:30.527",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20110,
    "planningID": "a43be754-1466-47ab-95c2-f4ebd0b13f2f",
    "batchID": "c206f921-45db-4ee1-bb6d-279a21286416",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-331",
    "productionCode": "451715300551170",
    "productionName": "SANPRENE IB-D20  D/M  1st-Org2",
    "quantityKgs": 9118.00,
    "product1SelectedCode": "451715300551170",
    "product1Name": "SANPRENE IB-D20  D/M  1st-Org2",
    "product1InBomName": "SANPRENE IB-D20  D/M  1st-Org2",
    "product1SelectedPackagingCode": "494601910",
    "product1PackagingName": "BC18D/M  1st-Org1",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 20,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "SANPRENE IB-D20  D/M  1st-Org2",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122416",
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": "2024-12-07T00:00:00",
    "remark": "test1",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH Apv1",
    "updatedDate": "2024-12-04T18:26:53",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20111,
    "planningID": "d63aa15f-357f-48e3-905c-a4282902d1a0",
    "batchID": "eecb1e12-aa87-413e-82cd-c8407fa21126",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451008201583800",
    "productionName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "quantityKgs": 3800.00,
    "product1SelectedCode": "451008201583800",
    "product1Name": "OIL-AR (800 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 800.00,
    "product1UomCount": 25,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-13T00:00:00",
    "finishedDate": "2024-12-13T00:00:00",
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T13:45:24.15",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20112,
    "planningID": "65a9c228-428e-4808-98da-e51ed4f5cd66",
    "batchID": "42ca7a4b-3f20-461b-a91c-d1ee8738d41b",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-04T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "451506101753180",
    "productionName": " OSMORIN DA-50 (180kg) D/M 1st-org1",
    "quantityKgs": 5943.00,
    "product1SelectedCode": "451506101753180",
    "product1Name": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product1InBomName": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 180.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OSMORIN DA-50 (180kg) D/M 1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122417",
    "producingDate": "2024-12-04T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-04T19:10:58.237",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20114,
    "planningID": "d9f8ca3d-e0e3-459a-80d3-da1bf7db9c3c",
    "batchID": "db1d715d-a6eb-4d01-8eac-977b8629f928",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-06T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-06T09:16:28.923",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20115,
    "planningID": "7c96b46b-6ff3-4f79-80eb-24b5be823f49",
    "batchID": "db1d715d-a6eb-4d01-8eac-977b8629f928",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-06T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-06T09:26:47.593",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20116,
    "planningID": "ff4b0470-9450-4bc7-a0a6-cb351170ea46",
    "batchID": "b4df09b0-1966-4da4-90cc-c5a69094f7b1",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-06T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "450926100561",
    "product1Name": "F-190  LORRY  1st-org1",
    "product1InBomName": "F-190  LORRY  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "F-190  LORRY  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-06T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-06T10:42:22.173",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20118,
    "planningID": "5f219677-419b-4998-99f2-16e7b8c43fd6",
    "batchID": "78b151a1-7c6e-4ddf-91a1-1d7d9ca2f48c",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-07T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-07T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-07T20:56:15.367",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20119,
    "planningID": "24d479c3-482a-4496-83f1-acbaf71bdd94",
    "batchID": "1cfc9ed4-4b3c-4a9b-92eb-a9ce28c479a6",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-08T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4518321005831250",
    "productionName": "CARRYBON F-1500SP  IBC  1st-org1",
    "quantityKgs": 10843.00,
    "product1SelectedCode": "4518321005831250",
    "product1Name": "CARRYBON F-1500SP  IBC  1st-org1",
    "product1InBomName": "CARRYBON F-1500SP  IBC  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CARRYBON F-1500SP  IBC  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122418",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": "2024-12-09T00:00:00",
    "remark": "n test1",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-08T18:24:42.65",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20123,
    "planningID": "a52a64f0-c44a-4312-8cbf-91c61ddd96e4",
    "batchID": "9be32d17-776f-420c-9c2f-98f9f83a2bb1",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-08T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "450926100561",
    "product1Name": "F-190  LORRY  1st-org1",
    "product1InBomName": "F-190  LORRY  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 2,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "F-190  LORRY  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-08T00:00:00",
    "finishedDate": "2024-12-08T00:00:00",
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T16:47:35.213",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20124,
    "planningID": "8e30a2c1-7b56-45ab-8f0a-124d6713f9f5",
    "batchID": "9be32d17-776f-420c-9c2f-98f9f83a2bb1",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-08T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4518321005831250",
    "productionName": "CARRYBON F-1500SP  IBC  1st-org1",
    "quantityKgs": 10843.00,
    "product1SelectedCode": "4518321005831250",
    "product1Name": "CARRYBON F-1500SP  IBC  1st-org1",
    "product1InBomName": "CARRYBON F-1500SP  IBC  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 8,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CARRYBON F-1500SP  IBC  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-08T00:00:00",
    "finishedDate": "2024-12-08T00:00:00",
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T16:47:35.213",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20125,
    "planningID": "759fdca7-812f-4c6a-a146-4f781e46feab",
    "batchID": "02467333-5b51-46f7-b35f-a96d11189157",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-08T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "450926100561",
    "product1Name": "F-190  LORRY  1st-org1",
    "product1InBomName": "F-190  LORRY  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 9,
    "product2SelectedCode": "4509261027831250",
    "product2Name": "F-190 IBC (EXPORT) 1ST-ORG1",
    "product2InBomName": "F-190  LORRY  1st-org1",
    "product2SelectedPackagingCode": "494603110",
    "product2PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product2PackingQtyKgs": 1250.00,
    "product2UomCount": 13,
    "lotNumber": "PA24122429",
    "producingDate": "2024-12-08T00:00:00",
    "finishedDate": null,
    "remark": "remark test 001",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T13:41:58.95",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20128,
    "planningID": "b3a1c40a-4dfb-4047-8fed-82ec4468e765",
    "batchID": "1cfc9ed4-4b3c-4a9b-92eb-a9ce28c479a6",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-08T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451008201583800",
    "productionName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "quantityKgs": 3800.00,
    "product1SelectedCode": "451008201583800",
    "product1Name": "OIL-AR (800 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 800.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-AR (800 KG) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122417",
    "producingDate": "2024-12-08T00:00:00",
    "finishedDate": "2024-12-08T00:00:00",
    "remark": "n test5",
    "statusId": 102,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-08T18:14:45.167",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20132,
    "planningID": "e53b0d6a-86f1-4b95-bd5f-340161ec73bf",
    "batchID": "47494f3d-15e9-42cd-923c-f5e1745718e2",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-321",
    "productionCode": "451640101753170",
    "productionName": "CATION PG-50  D/M  1st-org1",
    "quantityKgs": 6111.00,
    "product1SelectedCode": "451640101753170",
    "product1Name": "CATION PG-50  D/M  1st-org1",
    "product1InBomName": "CATION PG-50  D/M  1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 35,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CATION PG-50  D/M  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122422",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T01:34:13.01",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20133,
    "planningID": "b27717a1-2eb8-45b0-8cef-2dd6b85b78c7",
    "batchID": "9ee12613-9f41-4c3e-abe3-500aa06e06a8",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "4509261005831250",
    "product1Name": "F-190 (1250KG)  IBC  1st-org1",
    "product1InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122423",
    "producingDate": "2024-12-17T00:00:00",
    "finishedDate": null,
    "remark": "test",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T01:36:44.59",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20134,
    "planningID": "4b4387a1-71ea-414d-bc09-23c8ec1b543d",
    "batchID": "2e986a9e-1349-42ec-b2f8-44788da4e515",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-331",
    "productionCode": "451715300551170",
    "productionName": "SANPRENE IB-D20  D/M  1st-Org2",
    "quantityKgs": 9118.00,
    "product1SelectedCode": "451715300751170",
    "product1Name": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1SelectedPackagingCode": "494601930",
    "product1PackagingName": "BC18D/M  1st-Org2",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 100,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122424",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": "test9/12/2024",
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T08:57:30.87",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20135,
    "planningID": "d5211662-cb1f-4e6c-ba91-7f6510b0c1b0",
    "batchID": "2e986a9e-1349-42ec-b2f8-44788da4e515",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "451789102553200",
    "productionName": "AL-40  D/M  1st-org1 DO",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "451789102553200",
    "product1Name": "AL-40  D/M  1st-org1 DO",
    "product1InBomName": "AL-40  D/M  1st-org1 DO",
    "product1SelectedPackagingCode": "494604320",
    "product1PackagingName": "PL D/M small cap PackDelta Clean room",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 100,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "AL-40  D/M  1st-org1 DO",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122418",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": "2024-12-10T00:00:00",
    "remark": "test2",
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T09:12:54.463",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20136,
    "planningID": "b44e32f4-9c4b-402a-a60f-5aa2a5465b22",
    "batchID": "2e986a9e-1349-42ec-b2f8-44788da4e515",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T09:27:33.04",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20137,
    "planningID": "e2761871-0b10-4935-a619-3a777fbc4718",
    "batchID": "a63742c7-af9a-4c44-bda8-e39a249dd1e2",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T09:28:26.34",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20138,
    "planningID": "01a535f9-b61e-4ff8-9b16-06899d1d6ced",
    "batchID": "a63742c7-af9a-4c44-bda8-e39a249dd1e2",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T09:28:28.4",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20139,
    "planningID": "3f16dcb7-da14-4cce-8d8e-b165278263ae",
    "batchID": "89fd6a63-f041-45e6-9f12-b2ff641ec915",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "4509261005831250",
    "product1Name": "F-190 (1250KG)  IBC  1st-org1",
    "product1InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 9,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122425",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T09:37:44.48",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20140,
    "planningID": "7067ad9b-0804-43c3-87af-0191686bc5b7",
    "batchID": "c1a696f1-16dc-4ac6-aec7-13476cb74312",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-331",
    "productionCode": "451715300551170",
    "productionName": "SANPRENE IB-D20  D/M  1st-Org2",
    "quantityKgs": 9118.00,
    "product1SelectedCode": "451715300751170",
    "product1Name": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1SelectedPackagingCode": "494601910",
    "product1PackagingName": "BC18D/M  1st-Org1",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 53,
    "product2SelectedCode": "451715300751170",
    "product2Name": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product2InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product2SelectedPackagingCode": "494601910",
    "product2PackagingName": "BC18D/M  1st-Org1",
    "product2PackingQtyKgs": 170.00,
    "product2UomCount": 40,
    "lotNumber": "PA24122426",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": "2024-12-10T00:00:00",
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T09:43:15.387",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20141,
    "planningID": "b5cf5e00-7fa2-43a6-841a-d1dd9dab200a",
    "batchID": "116bb2c3-2590-48b1-8890-4fa0cda3ef80",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-311",
    "productionCode": "4509261005831250",
    "productionName": " F-190 (1250KG)  IBC  1st-org1",
    "quantityKgs": 11536.00,
    "product1SelectedCode": "4509261005831250",
    "product1Name": "F-190 (1250KG)  IBC  1st-org1",
    "product1InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 1250.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "F-190 (1250KG)  IBC  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122427",
    "producingDate": "2024-12-16T00:00:00",
    "finishedDate": "2024-12-16T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T10:23:20.68",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20142,
    "planningID": "d23a759c-e803-454d-8100-37796ebe8114",
    "batchID": "116bb2c3-2590-48b1-8890-4fa0cda3ef80",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-321",
    "productionCode": "451640101753170",
    "productionName": "CATION PG-50  D/M  1st-org1",
    "quantityKgs": 6111.00,
    "product1SelectedCode": "451640101753170",
    "product1Name": "CATION PG-50  D/M  1st-org1",
    "product1InBomName": "CATION PG-50  D/M  1st-org1",
    "product1SelectedPackagingCode": "494604610",
    "product1PackagingName": "PL D/M (9.5) 1st-Org-1(TAIKO)",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CATION PG-50  D/M  1st-org1",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24120002",
    "producingDate": "2024-12-23T00:00:00",
    "finishedDate": "2024-12-25T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T10:23:20.68",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20143,
    "planningID": "d44e7533-85e3-49e5-b284-3213940ebaaa",
    "batchID": "116bb2c3-2590-48b1-8890-4fa0cda3ef80",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": null,
    "reactorName": null,
    "productionCode": null,
    "productionName": "",
    "quantityKgs": null,
    "product1SelectedCode": null,
    "product1Name": null,
    "product1InBomName": null,
    "product1SelectedPackagingCode": null,
    "product1PackagingName": null,
    "product1PackingQtyKgs": null,
    "product1UomCount": null,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": null,
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T10:26:55.447",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20144,
    "planningID": "f6d6c88d-94ac-4f64-9035-c6316d7e771a",
    "batchID": "d68a91e1-0f95-4459-a89b-a8d1dbc0834c",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-201",
    "productionCode": "456198200753200",
    "productionName": "CHEMICLEAN AS-S142T D/M Clean",
    "quantityKgs": 5000.00,
    "product1SelectedCode": "456198200753200",
    "product1Name": "CHEMICLEAN AS-S142T D/M Clean",
    "product1InBomName": "CHEMICLEAN AS-S142T D/M Clean",
    "product1SelectedPackagingCode": "494605910",
    "product1PackagingName": "PL D/M (9.4) 1st-Org-1(EURO)",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 61,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "CHEMICLEAN AS-S142T D/M Clean",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122419",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": "2024-12-11T00:00:00",
    "remark": null,
    "statusId": 102,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T11:50:43.01",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20147,
    "planningID": "94c3967c-6ea6-4792-a22f-4531cc116cf1",
    "batchID": "d68a91e1-0f95-4459-a89b-a8d1dbc0834c",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-2",
    "reactorName": "21R-351",
    "productionCode": "455635500753200",
    "productionName": "BEAULIGHT LCA-25F PLD/M (EXP) TP-2 GL",
    "quantityKgs": 24941.00,
    "product1SelectedCode": "455635500753200",
    "product1Name": "BEAULIGHT LCA-25F PLD/M (EXP) TP-2 GL",
    "product1InBomName": "BEAULIGHT LCA-25F PLD/M (EXP) TP-2 GL",
    "product1SelectedPackagingCode": "494605910",
    "product1PackagingName": "PL D/M (9.4) 1st-Org-1(EURO)",
    "product1PackingQtyKgs": 200.00,
    "product1UomCount": 124,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "BEAULIGHT LCA-25F PLD/M (EXP) TP-2 GL",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": null,
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": "2024-12-12T00:00:00",
    "remark": null,
    "statusId": 101,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T12:00:53.917",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20148,
    "planningID": "032cf188-be00-4812-8a28-468038978754",
    "batchID": "eaa408a4-e00c-4792-b444-53ac983f484e",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451394201583925",
    "productionName": " OIL-BR (925 Kg) IBC CLEAN ROOM",
    "quantityKgs": 4380.00,
    "product1SelectedCode": "451394201583925",
    "product1Name": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 925.00,
    "product1UomCount": 4,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122420",
    "producingDate": "2024-12-10T00:00:00",
    "finishedDate": "2024-12-10T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T12:33:15.09",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20152,
    "planningID": "a1a1ac29-e0cf-425c-aced-c7fce3afc761",
    "batchID": "02467333-5b51-46f7-b35f-a96d11189157",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "Cleanroom",
    "reactorName": "13R-202",
    "productionCode": "451394201583925",
    "productionName": " OIL-BR (925 Kg) IBC CLEAN ROOM",
    "quantityKgs": 4380.00,
    "product1SelectedCode": "451394201583925",
    "product1Name": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product1InBomName": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product1SelectedPackagingCode": "494603110",
    "product1PackagingName": "IBC CONTAINER (SECOND HAND)  1st-Org1",
    "product1PackingQtyKgs": 925.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "OIL-BR (925 Kg) IBC CLEAN ROOM",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PC24122421",
    "producingDate": "2024-12-09T00:00:00",
    "finishedDate": null,
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "admin ",
    "updatedDate": "2024-12-09T14:21:08.917",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
  {
    "journalID": 20154,
    "planningID": "5d214868-45a5-4231-85b6-cfb8cd72b468",
    "batchID": "f84d39de-24ac-4136-bd9e-892d8a02fef4",
    "linkedJournalID": null,
    "seqNo": null,
    "inputDate": "2024-12-09T00:00:00",
    "plantName": "TP-1",
    "reactorName": "11R-331",
    "productionCode": "451715300551170",
    "productionName": "SANPRENE IB-D20  D/M  1st-Org2",
    "quantityKgs": 9118.00,
    "product1SelectedCode": "451715300751170",
    "product1Name": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product1SelectedPackagingCode": "494601930",
    "product1PackagingName": "BC18D/M  1st-Org2",
    "product1PackingQtyKgs": 170.00,
    "product1UomCount": 10,
    "product2SelectedCode": null,
    "product2Name": null,
    "product2InBomName": "SANPRENE IB-D20(Export)  D/M  1st-Org2",
    "product2SelectedPackagingCode": null,
    "product2PackagingName": null,
    "product2PackingQtyKgs": null,
    "product2UomCount": null,
    "lotNumber": "PA24122431",
    "producingDate": "2024-12-17T00:00:00",
    "finishedDate": "2024-12-18T00:00:00",
    "remark": null,
    "statusId": 103,
    "statusComments": null,
    "updatedBy": "WH2 ",
    "updatedDate": "2024-12-09T16:43:55.323",
    "submitedBy": " ",
    "planningApprovedBy": null,
    "actualStartBy": null,
    "actualFgEntryBy": null,
    "actualFinishedBy": null,
    "submitedDate": null,
    "planningApprovedDate": null,
    "actualStartDate": null,
    "actualFgEntryDate": null,
    "actualFinishedDate": null,
  },
])

const columns = ref(['name', 'value'])

const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = ref([10, 20, 30, 'All'])

//-------------------------------- sort

const sortField = ref(null)
const sortDirection = ref('asc')

//-------------------------------- pagiante
const totalItems = computed(() => items.value.length)

const totalPages = computed(() =>
  itemsPerPage.value === 'All'
    ? 1
    : Math.ceil(totalItems.value / itemsPerPage.value),
)

const startIndex = computed(() =>
  itemsPerPage.value === 'All' ? 1 : (currentPage.value - 1) * itemsPerPage.value + 1,
)

const endIndex = computed(() =>
  itemsPerPage.value === 'All'
    ? totalItems.value
    : Math.min(currentPage.value * itemsPerPage.value, totalItems.value),
)

// eslint-disable-next-line sonarjs/cognitive-complexity
const processedItems = computed(() => {
  // เรียงข้อมูลตามฟิลด์ที่กำหนด
  const sorted = !sortField.value
    ? items.value
    : [...items.value].sort((a, b) => {
      const fieldA = a[sortField.value]
      const fieldB = b[sortField.value]

      if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
      if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1

      return 0
    })

  // แบ่งหน้า
  if (itemsPerPage.value === 'All') {
    return sorted // แสดงทั้งหมดถ้าผู้ใช้เลือก 'All'
  }

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return sorted.slice(start, end)
})

const sortTable = field => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToFirstPage = () => {
  currentPage.value = 1
}

const goToLastPage = () => {
  currentPage.value = totalPages.value
}


//-------------------------------- select
const selectedItems = ref([])

// คำนวณสถานะ "เลือกทั้งหมด"
const selectAll = computed({
  get: () => {
    // ตรวจสอบว่ารายการทั้งหมดถูกเลือกหรือไม่
    return (
      selectedItems.value.length > 0 && 
      selectedItems.value.length === processedItems.value.length
    )
  },
  set: value => {
    // เมื่อเลือกทั้งหมดหรือยกเลิก
    if (value) {
      selectedItems.value = processedItems.value.map(item => item.planningID) // เลือกทั้งหมด
    } else {
      selectedItems.value = [] // ยกเลิกทั้งหมด
    }
  },
})

// ฟังก์ชันสำหรับจัดการ Checkbox "Select All"
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value // เปลี่ยนสถานะ "เลือกทั้งหมด"
}

watch(selectedItems, newVal => {
  console.log('Selected Items:', newVal)
})
</script>


<template>
  <div class="table-container">
    <Table class="frozen-table">
      <!-- ตารางข้อมูล -->
      <thead>
        <tr>
          <th rowspan="2">
            <VCheckbox
              v-model="selectAll"
              :value="selectedItems || selectAll"
              @change="toggleSelectAll"
            />
          </th>
          <th
            rowspan="2"
            @click="sortTable('statusId')"
          >
            Status ID
          </th>
          <th
            rowspan="2"
            @click="sortTable('no')"
          >
            No
          </th>
          <th
            rowspan="2"
            @click="sortTable('inputDate')"
          >
            Input Date
          </th>
          <th
            rowspan="2"
            @click="sortTable('plantName')"
          >
            Plant Name
          </th>
          <th
            rowspan="2"
            @click="sortTable('reactorName')"
          >
            Reactor Name
          </th>
          <th
            rowspan="2"
            @click="sortTable('productionCode')"
          >
            Production Code
          </th>
          <th
            rowspan="2"
            @click="sortTable('productionName')"
          >
            Production Name
          </th>
          <th
            rowspan="2"
            @click="sortTable('quantityKgs')"
          >
            Quantity (Kgs)
          </th>

          <th
            class="text-center"
            colspan="5"
            @click="sortTable('age')"
          >
            Item 1
          </th>

          <th
            class="text-center"
            colspan="5"
            @click="sortTable('age')"
          >
            Item 2
          </th>

          <th
            rowspan="2"
            @click="sortTable('lotNumber')"
          >
            Lot Number
          </th>
          <th
            rowspan="2"
            @click="sortTable('producingDate')"
          >
            Producing Date
          </th>
          <th
            rowspan="2"
            @click="sortTable('finishedDate')"
          >
            Finished Date
          </th>
          <th
            rowspan="2"
            @click="sortTable('remark')"
          >
            Remark
          </th>
          <th
            rowspan="2"
            @click="sortTable('updatedDate')"
          >
            Updated Date
          </th>
          <th
            rowspan="2"
            @click="sortTable('submitedBy')"
          >
            Submitted By
          </th>
          <th
            rowspan="2"
            @click="sortTable('age')"
          >
            Action
          </th>
        </tr>

        <tr>
          <th @click="sortTable('product1SelectedCode')">
            Item Code 1
          </th>
          <th @click="sortTable('product1Name')">
            Item Name 1
          </th>
          <th @click="sortTable('product1PackingQtyKgs')">
            Packing Type 1
          </th>
          <th @click="sortTable('product1PackingQtyKgs')">
            Packing KGS 1
          </th>
          <th @click="sortTable('product1UomCount')">
            Packaging PCS 1
          </th>

          <th @click="sortTable('product1SelectedCode')">
            Item Code 2
          </th>
          <th @click="sortTable('product1Name')">
            Item Name 2
          </th>
          <th @click="sortTable('product1PackingQtyKgs')">
            Packing Type 2
          </th>
          <th @click="sortTable('product1PackingQtyKgs')">
            Packing KGS 2
          </th>
          <th @click="sortTable('product1UomCount')">
            Packaging PCS 2
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in processedItems"
          :key="item.id"
        >
          <td>
            <VCheckbox
              v-model="selectedItems"
              :value="item.planningID"
            />
          </td>
          <td>{{ item.statusId }}</td>
          <td>{{ item.no }}</td>
          <td>{{ item.inputDate }}</td>
          <td>{{ item.plantName }}</td>
          <td>{{ item.reactorName }}</td>
          <td>{{ item.productionCode }}</td>
          <td>{{ item.productionName }}</td>
          <td>{{ item.quantityKgs }}</td>

          <td>{{ item.product1SelectedCode }}</td>
          <td>{{ item.product1Name }}</td>
          <td>{{ item.product1SelectedPackagingCode }}</td>
          <td>{{ item.product1PackingQtyKgs }}</td>
          <td>{{ item.product1UomCount }}</td>

          <td>{{ item.product2SelectedCode }}</td>
          <td>{{ item.product2Name }}</td>
          <td>{{ item.product2SelectedPackagingCode }}</td>
          <td>{{ item.product2PackingQtyKgs }}</td>
          <td>{{ item.product2UomCount }}</td> 

          <td>{{ item.lotNumber }}</td>
          <td>{{ item.producingDate }}</td>
          <td>{{ item.finishedDate }}</td>
          <td>{{ item.remark }}</td>
          <td>{{ item.updatedDate }}</td>
          <td>{{ item.submitedBy }}</td>
          <td>
            <VBtn color="info">
              Action
            </VBtn>
          </td>
        </tr>
      </tbody>
    </Table>

    <!-- Pagination และ Items Per Page -->
    <div class="d-flex align-center justify-space-between mt-4">
      <div class="d-flex align-center">
        <span>Items per page:</span>
        <VSelect
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          density="compact"
          style="max-width: 100px; margin-left: 8px;"
        />
      </div>
      <div class="d-flex align-center">
        <span>
          {{ startIndex }}-{{ endIndex }} of {{ totalItems }}
        </span>
        <VBtn
          icon
          variant="text"
          :disabled="currentPage === 1"
          @click="goToFirstPage"
        >
          <VIcon icon="mdi-chevron-double-left" />
        </VBtn>
        <VBtn
          icon
          variant="text"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <VIcon icon="mdi-chevron-left" />
        </VBtn>
        <VBtn
          icon
          variant="text"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <VIcon icon="mdi-chevron-right" />
        </VBtn>
        <VBtn
          icon
          variant="text"
          :disabled="currentPage === totalPages"
          @click="goToLastPage"
        >
          <VIcon icon="mdi-chevron-double-right" />
        </VBtn>
      </div>
    </div>
  </div>
</template>

<style  coped>
/* ตัว Container */
.table-container {
  border: 1px solid #ddd; /* เส้นขอบ */
  overflow-y: auto;  /* ทำให้เลื่อนเฉพาะแนวตั้ง */
}

.frozen-table th {
  position: sticky; /* ติดด้านบน */
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
  inset-block-start: 0; /* ระยะห่างจากขอบบน */
  text-align: start;
}

.frozen-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: start;
}

/* กำหนดการคง Header */
.frozen-table thead th {
  position: sticky; /* ติดด้านบน */
  z-index: 0; /* เพื่อให้ header อยู่เหนือเนื้อหาด้านล่าง */
  background-color: #f5f5f5; /* พื้นหลัง Header */
  border-block-end: 2px solid #ddd; /* เส้นขอบล่าง */
  inset-block-start: 0; /* ระยะห่างจากขอบบน */
  text-align: start;
}

/* เสริมความสวยงาม */
.frozen-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-space-between {
  justify-content: space-between;
}

.mt-4 {
  margin-block-start: 16px;
}
</style>
