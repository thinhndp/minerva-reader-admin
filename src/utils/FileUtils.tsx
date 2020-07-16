import { storage } from '../firebase/firebase';

export const uploadFilePromise = async (folder: string, file: any, name: string) => {
	const fileName = name.replace(/\s+/g, '');
	const fileExtension = file.name.split('.').pop();
	return new Promise((resolve, reject) => {
		const uploadTask = storage.ref(`${folder}/${fileName}.${fileExtension}`).put(file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {},
			(error) => {
				console.log(error);
				reject();
			},
			() => {
				storage
					.ref(folder)
					.child(`${fileName}.${fileExtension}`)
					.getDownloadURL()
					.then(url => {
						// console.log(url);
						resolve(url);
					})
			}
		);
	});
}
