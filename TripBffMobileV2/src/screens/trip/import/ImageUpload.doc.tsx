import React, { Component } from "react";
import { Container, Content, View } from "native-base";
import _ from "lodash";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import { Image } from "react-native";
import { uploadImage } from "../../../store/Trip/operations";
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { checkAndRequestPhotoPermissionAsync } from "../../../_function/commonFunc";

export interface IStateProps { }

interface IMapDispatchToProps {
    uploadImage: (uri: string, mimeType: StoreData.IMimeTypeImage) => Promise<string>;
}

export interface Props extends IMapDispatchToProps {
}

interface State {
    src: string;
}

export class ImageUploadInternal extends Component<Props & IStateProps, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            src: "https://placekitten.com/g/300/300"
        };
    }

    async componentDidMount() {
        console.log("hello there")
        await checkAndRequestPhotoPermissionAsync();


        const result = await loadPhotosWithinAsync(moment().add(-10, "day").unix(), moment().unix());
        if (result && result.length > 0) {
            const photo = result[0];
            console.log("photo 0", photo);
            const uri = photo.image.uri;
            const imageType = photo.image.type as StoreData.IMimeTypeImage
            this.props.uploadImage(uri, imageType)
                .then(({ thumbnailExternalUrl }) => {
                    console.log("thumbnailExternalUrl", thumbnailExternalUrl);
                    this.setState({
                        src: thumbnailExternalUrl
                    })
                })
        }
    }


    render() {
        const { src } = this.state;

        return (
            <Container>
                <Content>
                    <View>
                        <Image
                            style={{ width: 300, height: 300 }}
                            source={{
                                uri: src
                            }}
                        ></Image>
                    </View>
                </Content>
            </Container>
        );
    }
}


const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
    return {
        uploadImage: (a, b) => dispatch(uploadImage(a, b)),
    };
};

const ImageUploadDoc = connect(
    null,
    mapDispatchToProps
)(ImageUploadInternal);

export default ImageUploadDoc;