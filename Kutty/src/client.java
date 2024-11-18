import java.net.*;
import java.io.*;

class client{
     public static void main(String args[]){
          Socket s = null;
          String line ;
          PrintStream os,
          DataInputStream is ,is1;

        try{
           s = new Socket('localhost',8080);
        
        }catch(Exception e){
             System.out.printl("the error");
        }

        try{
              os = PrintStream(s.getOuputStream());
            is =  DataInputStream(System.in);
            is1 = DataInputStream(s.getOuputStream());
             do{
                line =  is.readLine();

                 if(!line.equals('exit'))
                   System.out(is1.readLine());
             }while(line.equals('exit'));

        }catch(Exception e){
             System.out.println("the error is occured");
        }
     }
}