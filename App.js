import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Picker
} from "react-native";

import { WebView } from 'react-native-webview';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      loading: true,
      user_id: "",
      client_id: "",
      api_key: "",
      init: false,
      env: "int-",
      widget: "connect_widget"
    };
  }

  

  getWidget() {
    if (this.state.widget === "connect_widget" || this.state.widget === "mobile_master_widget" || this.state.widget === "pulse_widget") {
      fetch(
        `https://${this.state.env}sso.moneydesktop.com/${this.state.client_id}/users/${this.state.user_id}/urls.json`,
        {
          body: `{\n  "url": {\n "type": "${this.state.widget}", \n "is_mobile_webview": "true", \n "ui_message_version": 4, \n "mode": "verification"}\n}`,
          headers: {
            Accept: "application/vnd.moneydesktop.sso.v3+json",
            "Content-Type": "application/vnd.moneydesktop.sso.v3+json",
            "Mx-Api-Key": `${this.state.api_key}`,
            // "Accept-Language": "fr-CA"
          },
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(
          result => {
            console.log(result.url.url);
            widgetURL = result.url.url;
            this.setState({
              url: widgetURL,
              loading: false
            });
          },
          error => {
            console.log(error);
          }
        )
        .catch(function() {
          console.log(
            "There has been a problem with your fetch operation: " 
          );
          throw error;
        });
    } else {
      fetch(
        `https://${this.state.env}sso.moneydesktop.com/${this.state.client_id}/users/${this.state.user_id}/urls/${this.state.widget}.json`,
        {
          headers: {
            Accept: "application/vnd.moneydesktop.sso.v3+json",
            "Md-Api-Key": `${this.state.api_key}`
          }
        }
      )
        .then(res => res.json())
        .then(
          result => {
            console.log(result.url.url);
            let widgetURL = result.url.url;
            this.setState({
              url: widgetURL,
              loading: false
            });
          },
          error => {
            console.log(error);
          }
        )
        .catch(function(error) {
          console.log(
            "There has been a problem with your fetch operation: " +
              error.message
          );
          throw error;
        });
    }
  }

  loadWidget() {
    if (this.state.loading) {
      return <ActivityIndicator style={styles.container} size="large" />;
    }

    const injectedJavascript = `
    function handleEvent(event) {
      if (event.data.mx) {
        console.log("working")
      }
    }
    
    window.addEventListener('message', handleEvent)
`;
    return (

      
      <WebView
        source={{
          uri: this.state.url
        }}
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavascript}
        onMessage={event => console.log(event.nativeEvent.data)}
        startInLoadingState
        style={{ flex: 1, marginTop: 50}}
        useWebKit
      />
    );
  }

  _handleSubmit() {
    this.setState({
      init: true
    });
    return this.getWidget();
  }

  init() {
    if (this.state.init) {
      return this.loadWidget();
    }
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <TextInput
            style={styles.inputStyle}
            label="user_id"
            placeholder="user_id"
            returnKeyType={"next"}
            onChangeText={user_id => this.setState({ user_id })}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
          <TextInput
            style={styles.inputStyle}
            label="client_id"
            placeholder="client_id"
            returnKeyType={"next"}
            onChangeText={client_id => this.setState({ client_id })}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
          <TextInput
            style={styles.inputStyle}
            label="api_key"
            placeholder="api_key"
            returnKeyType={"next"}
            onChangeText={api_key => this.setState({ api_key })}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />

          <Picker
            selectedValue={this.state.env}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ env: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="int" value="int-" />
            <Picker.Item label="prod" value="" />
          </Picker>

          <Picker
            selectedValue={this.state.widget}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ widget: itemValue })
            }
          >
            <Picker.Item label="accounts_widget" value="accounts_widget" />
            <Picker.Item label="budgets_widget" value="budgets_widget" />
            <Picker.Item label="cash_flow_widget" value="cash_flow_widget" />
            <Picker.Item label="connect_widget" value="connect_widget" />
            <Picker.Item
              label="connections_widget"
              value="connections_widget"
            />
            <Picker.Item label="debts_widget" value="debts_widget" />
            <Picker.Item label="goals_widget" value="goals_widget" />
            <Picker.Item label="help_widget" value="help_widget" />
            <Picker.Item
              label="investments_widget"
              value="investments_widget"
            />
            <Picker.Item label="master_widget" value="mobile_master_widget" />
            <Picker.Item label="net_worth_widget" value="net_worth_widget" />
            <Picker.Item
              label="notifications_settings_widget"
              value="notifications_settings_widget"
            />
            <Picker.Item label="pulse_widget" value="pulse_widget" />
            <Picker.Item label="settings_widget" value="settings_widget" />
            <Picker.Item label="spending_widget" value="spending_widget" />
            <Picker.Item
              label="transactions_widget"
              value="transactions_widget"
            />
            <Picker.Item label="trends_widget" value="trends_widget" />
          </Picker>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.button}
          onPress={this._handleSubmit.bind(this)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return this.init();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  inputStyle: {
    borderColor: "#CCCCCC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10
  },

  button: {
    alignItems: "center",
    borderColor: "#CCCCCC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    padding: 10,
    marginTop: 40
  },
  buttonText: {
    fontSize: 18
  }
});


