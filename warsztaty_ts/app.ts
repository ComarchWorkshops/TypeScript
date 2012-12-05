/// <reference path="js\lib\jquery-1.8.d.ts" />

var contentElement = document.getElementById('content');
var counter = 0;
var currentId = "";
var recycle = null;

class RecycleBin {
    name: string;
    htmlRec: HTMLElement;

    constructor (name: string)
    {
        this.name = name;
        this.htmlRec = document.getElementById('recycle');
        this.htmlRec.dragDrop;
        this.htmlRec.ondrop = onRecycleDrop;
        this.htmlRec.ondragover = allowDrop;
    }

    deleteChild(id: string) 
    {
        var patientDatas = contentElement.children;

        for (var i = 0; i < patientDatas.length; i++) {

            var currentElement = patientDatas[i];
            var currentElementID = currentElement.getAttribute("patID");

            if (currentElementID == id) 
            {
                contentElement.removeChild(currentElement);
            }
        }
    }

    deleteAll() 
    {
        var patientDatas = contentElement.children;
        for (var i = patientDatas.length - 1; i >= 0; i--) 
        {
            contentElement.removeChild(patientDatas[i]);
        }
    }
}

class Patient {
    id: number;
    firstName: string;
    secondaryNames: string;
    fullName: string;
    phone: string;
    email: string;
    photoUrl: string;
    creationTime: Date;
    birthDate: Date;
    address: string;
    pesel: string;
    info: string;
    sex: string;
    element: HTMLElement;
    photoDiv: HTMLElement;
    
    constructor (id:number, firstName:string, secondaryNames:string, fullName:string, phone:string, email:string, photoUrl:string, creationTime:Date, birthDate:Date, address:string, pesel:string, info:string, sex:string) { 
        this.id = counter;
        this.firstName = firstName;
        this.secondaryNames = secondaryNames;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.photoUrl = photoUrl;
        this.creationTime = creationTime;
        this.birthDate = birthDate;
        this.address = address;
        this.pesel = pesel;
        this.info = info;
        this.sex = sex;
    }

    renderPatientData(htmlElement: HTMLElement) {

        var container = document.createElement('div');
        container.className = "patientContainer";
        container.setAttribute("patID", this.id + "");
        container.draggable = true;
        container.ondragstart = onContainerDrag;
        container.ondragend = onContainerDrop;
        container.ondblclick = this.onDoubleClick;
        this.element = container;

        var infoContainer = document.createElement('div');
        infoContainer.className = "infoContainer";
        
        this.appendLbl(container, this.checkValue(this.firstName) + " " + this.checkValue(this.secondaryNames) + " " + this.checkValue(this.fullName) + "[" + this.id + "]", "patientMainLabel");
        this.appendLbl(infoContainer, "tel: " + this.checkValue(this.phone) + "\n" + "e-mail: " + this.checkValue(this.email) + "\n" + this.checkValue(this.address), "patientSubLabel");
        this.appendLbl(infoContainer, this.getDateString(this.birthDate) + "\n" + "PESEL: " + this.checkValue(this.pesel), "patientSubLabel");
        this.appendLbl(infoContainer, this.checkValue(this.sex),"patientSubLabel");
        this.appendLbl(container, this.checkValue(this.info), "patientSubLabel");
        
        this.appendImage(this.photoUrl);

        container.appendChild(infoContainer);
        htmlElement.appendChild(container);
    }

    getDateString(date: Date) : string
    {
        if (!date) 
        {
            return '';
        }

        var retValue = "ur: ";

        retValue += date.getFullYear() + ".";
        retValue += date.getMonth() + ".";
        retValue += date.getDay();

        return retValue;
    }

    checkValue(toCheck: any) : string
    {
        if (!toCheck) return '-';

        return toCheck + '';
    }

    appendImage(url: string) 
    {
        var imDiv = document.createElement('div');
        imDiv.className = 'photoDiv';
        
        
        if (url) 
        {
            $(imDiv).css("background-image", "url('"+ url +"')");
            $(imDiv).hover(function () 
            {
                $(this).css("opacity", 1);
            }, function () { 
                $(this).css("opacity", 0.5);
            }
            );
        }
                        
        this.photoDiv = imDiv;
        this.element.appendChild(this.photoDiv);


    }

    appendLbl(el, val : string, lblClass : string) {
        var nameLbl = document.createElement('p');
        nameLbl.className = lblClass;
        nameLbl.innerText = val;
        el.appendChild(nameLbl);
    }

    onDoubleClick()
    {
        addPatient();
    }
}

function addPatient()
{
    var patient = new Patient(counter++, "Andrzej", "Bartek", "Kot", "515-234-123", "mm@interia.pl", "res/gfx/test.jpg", null, new Date(1976, 10, 23, 0, 0, 0, 0), "ul.Kamienna 16/2", "76102300492", "Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. Zaburzenia hiperwerbalne. ", "M");
    patient.renderPatientData(contentElement);  
}


//events:

function onContainerDrag(e:DragEvent) 
{
    currentId = this.getAttribute("patID");
    recycle.htmlRec.className = "binIconHighlight";
}

function onContainerDrop(e: DragEvent) 
{
    recycle.htmlRec.className = "binIcon";
}

function allowDrop(e: DragEvent)
{
    e.preventDefault();
}

function onRecycleDrop(e:DragEvent) 
{
    recycle.deleteChild(currentId);
}

window.onload = () => {

    initialize();
    contentElement = document.getElementById('content');
    addPatient();
};


function initialize()
{
    recycle = new RecycleBin("kosz");

    $("#addPatientBtn").click(addPatient);
    $("#resetBtn").click(function () {
        recycle.deleteAll();
    });

}
//