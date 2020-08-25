import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { GlobalConstants } from './global.constants';

@Injectable({
  providedIn: 'root'
})
export class FsService {
  boardRef = firebase.firestore().collection('boards');
  cardRef = firebase.firestore().collection('cards');
  userRef = firebase.firestore().collection('users');
  xeroxRef = firebase.firestore().collection('xerox_reading');
  readingHistoryRef = firebase.firestore().collection('reading_history');
  notificationRef = firebase.firestore().collection('notifications');
  workTypeRef = firebase.firestore().collection('work_type');
  statusRef = firebase.firestore().collection('status');
  orderRef = firebase.firestore().collection('work_order');
  policyDetailsRef = firebase.firestore().collection('policy_details');
  docId = "GG26nB5C1FpcdiW0xPH9";
  constructor(private gc: GlobalConstants) { }

  getDashboardValues(): Observable<any> {
    return new Observable((observer) => {
      let totalCards = 0;
      let pendingOrders = 0;
      let totalOrders = 0;
      let completedOrders = 0;
      let models = 0;
      let outOfStock = 0;
      this.cardRef.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          totalCards = totalCards + Number(data.available);
          if (data.available == 0) {
            ++outOfStock;
          }
          ++models;
        });

        this.orderRef.onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            if (data.status == this.gc.STATUS_PENDING || data.status == this.gc.STATUS_PROCESSING) {
              ++pendingOrders;
            } else {
              ++completedOrders;
            }
            ++totalOrders;
          });
          this.getLatestReading()
            .subscribe(data => {
              observer.next({
                cardsAvailable: totalCards,
                cardsModels: models,
                outOfStock: outOfStock,
                pendingOrders: pendingOrders,
                xeroxReading: data.bwReading,
                totalOrders: totalOrders,
                completedOrders: completedOrders,
                // xeroxUpdatedDate: data.date.toDate()
              });
            });
        });
      });
    });
  }


  getBoards(): Observable<any> {
    return new Observable((observer) => {
      this.boardRef.onSnapshot((querySnapshot) => {
        let boards = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          boards.push({
            key: doc.id,
            title: data.title,
            description: data.description,
            author: data.author
          });
        });
        observer.next(boards);
      });
    });
  }

  getCards(): Observable<any> {
    return new Observable((observer) => {
      this.cardRef.orderBy('createdOn', 'desc').onSnapshot((querySnapshot) => {
        let boards = [];
        let i = 0;
        querySnapshot.forEach((doc) => {
          ++i;
          let data = doc.data();
          boards.push({
            key: doc.id,
            cardId: i,
            price: data.price,
            available: data.available,
            image: data.image,
            model: data.model,
            createdOn: data.createdOn
          });
        });
        observer.next(boards);
      });
    });
  }

  getUser(id: string): Observable<any> {
    return new Observable((observer) => {
      this.userRef.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          country: data.country,
          aboutMe: data.aboutMe,
          address: data.address,
          city: data.city,
          designation: data.designation,
          postalCode: data.postalCode,
          fullName: data.firstName + ' ' + data.lastName,
          profilePic: data.profilePic,
          admin: data.admin
        });
      });
    });
  }

  getLatestReading(): Observable<any> {
    return new Observable((observer) => {
      this.xeroxRef.doc("xerox_reading").get().then((doc) => {
        let data = doc.data();
        observer.next({
          bwReading: data.bwReading,
          color1Reading: data.color1Reading,
          color2Reading: data.color2Reading,
          date: data.date
        });
      });
    });
  }

  updateUser(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.userRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  setNotifyFalse(): Observable<any> {
    return new Observable((observer) => {
      this.notificationRef.onSnapshot((querySnapshot) => {
        let notifications = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.show = false;
          this.notificationRef.doc(doc.id).set(data).then(() => {
            observer.next();
          });
        });
        observer.next(notifications);
      });
    });
  }


  getNotifications(): Observable<any> {
    return new Observable((observer) => {
      this.notificationRef.onSnapshot((querySnapshot) => {
        let notifications = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          notifications.push({
            key: doc.id,
            notification: data.notification,
            show: data.show,
          });
        });
        observer.next(notifications);
      });
    });
  }

  updateReadings(data): Observable<any> {
    return new Observable((observer) => {
      this.xeroxRef.doc("xerox_reading").set(data).then(() => {
        observer.next();
      });
    });
  }

  postReadingHistory(data): Observable<any> {
    return new Observable((observer) => {
      this.readingHistoryRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  savePolicyHolderDetails(data): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.add(data).then((doc) => {
        observer.next({
          key: doc.id
        });
      });
    });
  }

  updatePolicyHolderDetails(id, data): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  getCard(id: string): Observable<any> {
    return new Observable((observer) => {
      this.cardRef.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          model: data.model,
          available: data.available,
          price: data.price,
          createdOn: data.createdOn,
          image: data.image
        });
      });
    });
  }

  updateCard(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.cardRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  postCard(data): Observable<any> {
    return new Observable((observer) => {
      this.cardRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  deleteCard(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.cardRef.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

  getOrders(): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.orderBy('createdOn', 'desc').onSnapshot((querySnapshot) => {
        let orders = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          orders.push({
            key: doc.id,
            cardModel: data.cardModel,
            cardModelId: data.cardModelId,
            deliveryDate: data.deliveryDate.toDate(),
            strDeliveryDate: this.formatDate(data.deliveryDate.toDate()),
            mobile: data.mobile,
            name: data.name,
            noOfCards: data.noOfCards,
            paid: data.paid,
            total: data.total,
            type: data.type,
            typeDesc: data.typeDesc,
            statusId: data.statusId,
            status: data.status,
            balance: Number(data.total) - Number(data.paid)
          });
        });
        observer.next(orders);
      });
    });
  }

  getTop3Orders(): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.where('status', '==', 'Pending').onSnapshot((querySnapshot) => {
        let orders = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          orders.push({
            key: doc.id,
            cardModel: data.cardModel,
            cardModelId: data.cardModelId,
            deliveryDate: data.deliveryDate.toDate(),
            strDeliveryDate: this.formatDate(data.deliveryDate.toDate()),
            mobile: data.mobile,
            name: data.name,
            noOfCards: data.noOfCards,
            paid: data.paid,
            total: data.total,
            type: data.type,
            typeDesc: data.typeDesc,
            statusId: data.statusId,
            status: data.status,
            balance: Number(data.total) - Number(data.paid)
          });
        });
        observer.next(orders);
      });
    });
  }

  getWorkTypes(): Observable<any> {
    return new Observable((observer) => {
      this.workTypeRef.orderBy('order').onSnapshot((querySnapshot) => {
        let workTypes = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          workTypes.push({
            key: doc.id,
            type: data.type,
          });
        });
        observer.next(workTypes);
      });
    });
  }

  getStatusList(): Observable<any> {
    return new Observable((observer) => {
      this.statusRef.orderBy('order').onSnapshot((querySnapshot) => {
        let status = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          status.push({
            key: doc.id,
            status: data.status,
          });
        });
        observer.next(status);
      });
    });
  }

  createOrder(data): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  getReadingHistory(): Observable<any> {
    return new Observable((observer) => {
      this.readingHistoryRef.orderBy('date', 'desc').onSnapshot((querySnapshot) => {
        let history = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          history.push({
            key: doc.id,
            previousBwReading: data.previousBwReading,
            bwReading: data.bwReading,
            diffBwReading: Number(data.bwReading) - Number(data.previousBwReading),
            previousColor1Reading: data.previousColor1Reading,
            color1Reading: data.color1Reading,
            diffColor1Reading: Number(data.color1Reading) - Number(data.previousColor1Reading),
            previousColor2Reading: data.previousColor2Reading,
            color2Reading: data.color2Reading,
            diffColor2Reading: Number(data.color2Reading) - Number(data.previousColor2Reading),
            date: this.formatDate(data.date.toDate())
          });
        });
        observer.next(history);
      });
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  compareTwoDates(date1: Date, date2: Date): string {
    const day1 = date1.getDate();
    const month1 = date1.getMonth() + 1;
    const year1 = date1.getFullYear();

    const day2 = date2.getDate();
    const month2 = date2.getMonth() + 1;
    const year2 = date2.getFullYear();

    if (year1 == year2 && month1 == month2) {
      let diff = day2 - day1;
      if (diff == 0) {
        return 'today';
      } else if (diff == 1) {
        return 'tomorrow';
      } else if (diff == -1) {
        return 'yesterday';
      } else if (diff < -1) {
        return diff * (-1) + ' days';
      }
    }

    return 'other';
  }

  getOrder(id: string): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          cardModel: data.cardModel,
          cardModelId: data.cardModelId,
          deliveryDate: data.deliveryDate,
          mobile: data.mobile,
          name: data.name,
          noOfCards: data.noOfCards,
          paid: data.paid,
          total: data.total,
          type: data.type,
          typeDesc: data.typeDesc,
          statusId: data.statusId,
          status: data.status,
          createdOn: data.createdOn
        });
      });
    });
  }

  updateOrder(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteOrder(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.orderRef.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

  getNotificationFromOrders(): Observable<any> {
    return new Observable((observer) => {
      this.orderRef.onSnapshot((querySnapshot) => {
        let notifications = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let today = new Date();
          if (data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'tomorrow') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " is not yet started. It has to be deliver by tomorrow",
            });
          } else if (data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'tomorrow') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " has to be deliver by tomorrow",
            });
          } else if (data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'today') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " is not yet started. It has to be deliver by today",
            });
          } else if (data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'today') {
            notifications.push({
              notification: "It's time to deliver " + data.name + "'s " + data.typeDesc,
            });
          } else if (data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'yesterday') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " is not yet started. It has to be deliver by yesterday only",
            });
          } else if (data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'yesterday') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " should be delivered by yesterday only",
            });
          } else if (data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) != 'other') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " is not yet started. It is overdued by " + this.compareTwoDates(today, data.deliveryDate.toDate()) + ". Deliver as soon as possible",
            });
          } else if (data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) != 'other') {
            notifications.push({
              notification: data.name + "'s " + data.typeDesc + " is overdued by " + this.compareTwoDates(today, data.deliveryDate.toDate()) + ". Deliver as soon as possible",
            });
          }

          /*if(data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'tomorrow'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" ఇంకా ప్రారంభించబడలేదు. ఇది రేపు డెలివరీ చేయాలి",
            });
          }else if(data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'tomorrow'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" రేపు డెలివరీ చేయాలి",
            });
          }else if(data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'today'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" ఇంకా ప్రారంభించబడలేదు. ఇది నేడు డెలివరీ చేయాలి",
            });
          }else if(data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'today'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc + " డెలివరీ చేయవలసిన సమయం అయినది",
            });
          }else if(data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'yesterday'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" ఇంకా ప్రారంభించబడలేదు. ఇది నిన్ననే పంపిణీ చేయాలి",
            });
          }else if(data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) == 'yesterday'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" నిన్ననే పంపిణీ చేయాలి",
            });
          }else if(data.status == 'Pending' && this.compareTwoDates(today, data.deliveryDate.toDate()) != 'other'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+" ఇంకా ప్రారంభించబడలేదు. ఇది " + this.compareTwoDates(today, data.deliveryDate.toDate())+" రోజుల క్రితమే డెలివరీ చేయాలి",
            });
          }else if(data.status == 'Processing' && this.compareTwoDates(today, data.deliveryDate.toDate()) != 'other'){
            notifications.push({
              notification: data.name+"'s "+data.typeDesc+ this.compareTwoDates(today, data.deliveryDate.toDate())+" రోజుల క్రితమే డెలివరీ చేయాలి",
            });
          }*/
        });
        observer.next(notifications);
      });
    });
  }

  getPolicyByPolicyNo(policyNo: number): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.where("policy_no", "==", policyNo).onSnapshot((querySnapshot) => {
        let policies = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          policies.push({
            policy_no: data.policy_no,
            name: data.name,
            phone: data.phone,
            doc: data.doc,
            plan_term: data.plan_no + ' - ' + data.plan_term,
            mode: data.mode,
            premium: data.premium,
            dob: data.dob,
            maturity_date: data.maturity_date,
            sum_assured: data.sum_assured,
            nominee: data.nominee,
            nominee_age: data.nominee_age,
            address: data.address
          });
        });
        observer.next(policies);
      });
    });
  }

  getPoliciesByName(name): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.where('name','==',name).onSnapshot((querySnapshot) => {
        let policies = [];
        let i = 0;
        querySnapshot.forEach((doc) => {
          ++i;
          let data = doc.data();
          policies.push({
            key: doc.id,
            sno: i,
            address: data.address,
            dob: data.dob,
            doc: data.doc,
            maturity_date: data.maturity_date,
            mode: data.mode,
            name: data.name,
            nominee: data.nominee,
            nominee_age: data.nominee_age,
            nominee_relationship: data.nominee_relationship,
            phone: data.phone,
            plan_no: data.plan_no,
            plan_term: data.plan_no + ' - ' + data.plan_term,
            policy_no: data.policy_no,
            premium: data.premium,
            sum_assured: data.sum_assured
          });
        });
        observer.next(policies);
      });
    });
  }

  getAllPolicies(): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.orderBy('policy_no', 'asc').onSnapshot((querySnapshot) => {
        let policies = [];
        let i = 0;
        querySnapshot.forEach((doc) => {
          ++i;
          let data = doc.data();
          policies.push({
            key: doc.id,
            sno: i,
            address: data.address,
            dob: data.dob,
            doc: data.doc,
            maturity_date: data.maturity_date,
            mode: data.mode,
            name: data.name,
            nominee: data.nominee,
            nominee_age: data.nominee_age,
            nominee_relationship: data.nominee_relationship,
            phone: data.phone,
            plan_no: data.plan_no,
            plan_term: data.plan_no + ' - ' + data.plan_term,
            policy_no: data.policy_no,
            premium: data.premium,
            sum_assured: data.sum_assured
          });
        });
        observer.next(policies);
      });
    });
  }

  getDueList(date): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.orderBy('policy_no', 'asc').onSnapshot((querySnapshot) => {
        let policies = [];
        let i = 0;
        querySnapshot.forEach((doc) => {
          ++i;
          let data = doc.data();
          let month = Number(data.doc.split("-")[1]);
          let flag : boolean = false;
          if(data.mode == 'M' || data.mode == 'm'){
            for(var i = 1; i <=12 ; ++i){
              if(month == date){
                flag = true;
                break;
              }
              month = month + 1;
              if(month > 12){
                month = month - 12;
              }
            }
          }else if (data.mode == 'Q' || data.mode == 'q'){
            for(var i = 1; i <= 4 ; ++i){
              if(month == date){
                flag = true;
                break;
              }
              month = month + 4;
              if(month > 12){
                month = month - 12;
              }
            }
          }else if (data.mode == 'H' || data.mode == 'h'){
            for(var i = 1; i <= 2 ; ++i){
              if(month == date){
                flag = true;
              }
              month = month + 6;
              if(month > 12){
                month = month - 12;
              }
            }
          }else if (data.mode == 'Y' || data.mode == 'y'){
            if(month == date){
              flag = true
            }
          }
          if(flag){
            policies.push({
              key: doc.id,
              sno: i,
              address: data.address,
              dob: data.dob,
              doc: data.doc,
              maturity_date: data.maturity_date,
              mode: data.mode,
              name: data.name,
              nominee: data.nominee,
              nominee_age: data.nominee_age,
              nominee_relationship: data.nominee_relationship,
              phone: data.phone,
              plan_no: data.plan_no,
              plan_term: data.plan_no + ' - ' + data.plan_term,
              policy_no: data.policy_no,
              premium: data.premium,
              sum_assured: data.sum_assured
            });
          }
        });
        observer.next(policies);
      });
    });
  }

  deletePolicy(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.policyDetailsRef.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

  getPolicy(id: string): Observable<any> {
    return new Observable((observer) => {
      this.policyDetailsRef.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          address: data.address,
          dob: data.dob,
          doc: data.doc,
          maturity_date: data.maturity_date,
          mode: data.mode,
          name: data.name,
          nominee: data.nominee,
          nominee_age: data.nominee_age,
          nominee_relationship: data.nominee_relationship,
          phone: data.phone,
          plan_no: data.plan_no,
          plan_term: data.plan_term,
          policy_no: data.policy_no,
          premium: data.premium,
          sum_assured: data.sum_assured
        });
      });
    });
  }
}
