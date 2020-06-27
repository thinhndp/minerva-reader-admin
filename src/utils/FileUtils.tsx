import { storage } from '../firebase/firebase';

export const uploadFilePromise = async (folder: string, file: any) => {
	return new Promise((resolve, reject) => {
		const uploadTask = storage.ref(`${folder}/${file.name}`).put(file);
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
					.child(file.name)
					.getDownloadURL()
					.then(url => {
						// console.log(url);
						resolve(url);
					})
			}
		);
	});
}
