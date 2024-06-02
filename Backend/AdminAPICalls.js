url = `https://calenderapp-b6878-default-rtdb.firebaseio.com/`;

export const addEventHandler = async(formData) =>{
    let stream = formData.stream;
    if(stream === 'BE')
    {
       stream = `${stream}/${formData.dept}`;
    }else{
      stream = `${stream}/dept`;
    }
    const data = { 
        time: formData.time,
        title: formData.title,
        description: formData.description,
        range:formData.range
      };
    const res = await fetch(
      `${url}eventData/${stream}/${formData.sem}.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
     if(res.ok){
      return true;
     }
     return false;
  }


