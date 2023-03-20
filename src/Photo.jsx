import {useEffect, useState} from 'react'
import { supabase } from './supabaseClient'

function Photo({ url, size, onUpload}) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [uploading, setUploading] = useState(false);


    const downloadImage = async (path) => {
        try {
         const { data, err} = await supabase.storage.from('avatars').download(path)
         if(err){
            throw err
         }
         const url = URL.createObjectURL(data)
         setPhotoUrl(url)
            
        } catch (error) {
            console.log('Error downloading Image', error.message)
            
        }
    }

    useEffect(() => {
        if(url){
            downloadImage(url)
        }
    }, [url])

 const uploadPhoto = async (event) => {
    try {
        setUploading(true)
        if(!event.target.files || event.target.files.length == 0){
            throw new Error('You must select n image to upload')
        }

        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

        if(uploadError){
            throw uploadError
        }

        onUpload(event, filePath)
    } catch (error) {
        alert(error.message) 
    }finally{
        setUploading(false)
    }
 }
  return (
    <div>
        {photoUrl ? (
            <img
            src={photoUrl}
            alt ='Avatar'
            className = 'avatar image'
            style ={{height: size, width: size}}
            />
        ): (
            <div className='avatar no-image' style={{height: size, width: size}}></div>
        )
        }
        <div style={{ width: size}}>
            <label className='button primary block' htmlFor='single'>
                {uploading ? 'uploading...' : 'Upload'}
                </label> 
        <input
        style={{
            visiblity: 'none',
            position: 'absolute',
        }}
        type = 'file'
        id='single'
        accept='image/**'
        onChange={uploadPhoto}
        disabled= {uploading}
        />
        </div>
    </div>
  )
}

export default Photo