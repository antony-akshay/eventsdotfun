export async function POST(req: Request) {

  interface JsonBinResponse {
    status:number;
    uri:string;
    id:string;
  }


  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const event_name = form.get("event_name") as string;
    const description = form.get("description") as string;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const uploadForm = new FormData();
    uploadForm.append("reqtype", "fileupload");
    uploadForm.append("fileToUpload", file);

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: uploadForm,
    });

    const text = await res.text(); // Catbox returns plain text URL

    const NftMetadata = {
      "name": event_name,
      "symbol": "EDF",
      "description": description,
      "image": text
    };

    const jsonString = JSON.stringify(NftMetadata);

    console.log("jsonString:", jsonString);

    // const jsonres = await fetch("https://api.jsonbin.io/v3/b", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-Master-Key": "$2a$10$iFJtjFvDRehOzcAc7XxWYuI1.0cGl6v.I9pShwQCrzp/uQNTn5I6O",
    //     "X-Access-Key": "$2a$10$M/H1k5GZ1Um5QtoJiqyLM.n4uZ2yqkv7C3qaJaRiYPvmV5FYP3x/G"
    //   },
    //   body: jsonString
    // });

    // console.log("jsonres : ", jsonres);

    // const data: JsonBinResponse = await jsonres.json();
    // const binId: string = data.metadata.id;

    // console.log("binId :  ", binId);

    // const finalUrl = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;

    // console.log("finalUrl : ",finalUrl);


    //extendsclass implementation
    const jsonres = await fetch("https://json.extendsclass.com/bin",{
      method:"POST",
      headers:{
        "Api-key":"3b1bd95b-c247-11f0-9924-0242ac110008",
      },
      body:jsonString
    });

    console.log("jsonres : ", jsonres);

    const data: JsonBinResponse = await jsonres.json();

    console.log("url:",data.uri);

    return new Response(JSON.stringify({ url: data.uri}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
