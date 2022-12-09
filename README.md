# TechRev-assignment 

 RUN COMMAND -  "npm start".

 TO COMPLETE THIS ASSIGNMENT , I CREATE TWO MODULE/SCHEMA

1)CUSTOMER MODEL :--THIST MODEL CONSIST OF SOME KEY AND VALUE PAIRS , KEYS ARE GIVEN BELLOW.

 fname:{
        type:String,
        required:true,
        trim:true,
    },
    lname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    
    isDeleted:{
        type:Boolean,
        default:false,
    }

    2)ADDRESS MODEL:-THIS MODEL ALSO CONSIST  OF KEY AND VALUE PAIRS.
     city:{
        type:String,
        required:true,
    },
    dist:{
        type:String,
        requires:true,
    },
    state:{
        type:String,
        required:true,

    },
    pincode:{
        type:Number,
        required:true,

    },
    customerId:{
       type:objectId,
       required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }

ALL LOGIC ARE WRITE IN CONTROLLER FILE , I USE JWT FOR AUTHENTICATION AND AUTHORIZATION PURPOSE .
MIDDLEWARE FUNCTION IS WRITE IN "middleware/auth.js" file.
USE MONGODB AS DATABASE , YOU CAN SEE MY DB TO CONNECT WITH THE CLUSTER IN YOUR PC/LAPTOP ,CLUSTER LINK IS GIVEN IN INEX FILE(LINE NO:15), COLLECTION NAME :-----techev-assignment

THANK YOU 



